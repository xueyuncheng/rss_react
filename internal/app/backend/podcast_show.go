package backend

import (
	"backend/internal/pkg/constant"
	"backend/internal/pkg/database"
	"backend/internal/pkg/table"
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"path"
	"time"

	"github.com/jinzhu/copier"
	"github.com/minio/minio-go/v7"
	"github.com/mmcdole/gofeed"
	"gorm.io/gorm"
)

type Show struct {
	ID              int       `json:"id"`
	Name            string    `json:"name"`
	Description     string    `json:"description"`
	Address         string    `json:"address"`
	PublishedAt     time.Time `json:"published_at"`
	ImageURL        string    `json:"image_url"`
	ImageObjectName string    `json:"image_object_name"`
}

type ListShowReq struct {
	Page
}

type ListShowResp struct {
	Total int64   `json:"total"`
	Items []*Show `json:"items"`
}

func (b *Backend) ListShow(ctx context.Context, req *ListShowReq) (*ListShowResp, error) {
	var shows []*table.PodcastShow
	if err := getTx(ctx).Order("id").Offset(req.Offset()).Limit(req.Limit()).Find(&shows).Error; err != nil {
		slog.Error("tx.Find() error", "err", err)
		return nil, fmt.Errorf("tx.Find() error, err = %w", err)
	}

	var total int64
	if err := getTx(ctx).Model(&table.PodcastShow{}).Count(&total).Error; err != nil {
		slog.Error("tx.Count() error", "err", err)
		return nil, fmt.Errorf("tx.Count() error, err = %w", err)
	}

	var items []*Show
	if err := copier.Copy(&items, shows); err != nil {
		slog.Error("copier.Copy() error", "err", err)
		return nil, fmt.Errorf("copier.Copy() error, err = %w", err)
	}

	resp := &ListShowResp{
		Total: total,
		Items: items,
	}

	go func() {
		if !b.isPodcastRefreshing.CompareAndSwap(false, true) {
			slog.Info("podcast is refreshing")
			return
		}

		slog.Info("refreshShowAll() start")
		defer slog.Info("refreshShowAll() end")
		_ = refreshShowAll(b.db)
		defer b.isPodcastRefreshing.Store(false)
	}()

	return resp, nil
}

func refreshShowAll(db *database.Database) error {
	var shows []*table.PodcastShow
	if err := db.DB.Find(&shows).Error; err != nil {
		slog.Error("tx.Find() error", "err", err)
		return fmt.Errorf("tx.Find() error, err = %w", err)
	}

	for _, show := range shows {
		if err := db.DB.Transaction(func(tx *gorm.DB) error {
			ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
			defer cancel()

			episodes, publishedAt, err := refreshShow(ctx, show)
			if err != nil {
				slog.Error("refreshShow() error", "err", err)
				return fmt.Errorf("refreshShow() error, err = %w", err)
			}

			if len(episodes) == 0 {
				return nil
			}

			if err := tx.Create(episodes).Error; err != nil {
				slog.Error("tx.Create() error", "err", err)
				return fmt.Errorf("tx.Create() error, err = %w", err)
			}

			if err := tx.Where("id = ?", show.ID).
				Updates(&table.PodcastShow{PublishedAt: publishedAt}).Error; err != nil {
				slog.Error("tx.Updates() error", "err", err)
				return fmt.Errorf("tx.Updates() error, err = %w", err)
			}

			return nil
		}); err != nil {
			return fmt.Errorf("db.DB.Transaction() error, err = %w", err)
		}
	}

	return nil
}

func refreshShow(ctx context.Context, show *table.PodcastShow) ([]*table.PodcastEpisode, time.Time, error) {
	fp := gofeed.NewParser()
	feed, err := fp.ParseURLWithContext(show.Address, ctx)
	if err != nil {
		slog.Error("fp.ParseURLWithContext() error", "err", err)
		return nil, time.Time{}, fmt.Errorf("fp.ParseURLWithContext() error, err = %w", err)
	}

	newItems := make([]*table.PodcastEpisode, 0, len(feed.Items))
	var latestPublishedAt time.Time
	for _, item := range feed.Items {
		if !item.PublishedParsed.After(show.PublishedAt) {
			continue
		}

		var enclosureURL string
		if len(item.Enclosures) > 0 {
			enclosureURL = item.Enclosures[0].URL
		}

		var publishedAt time.Time
		if item.PublishedParsed != nil {
			publishedAt = *item.PublishedParsed

			if publishedAt.After(latestPublishedAt) {
				latestPublishedAt = publishedAt
			}
		}

		var duration string
		if item.ITunesExt != nil {
			duration = item.ITunesExt.Duration
		}

		newItem := &table.PodcastEpisode{
			Name:         item.Title,
			ShowID:       int(show.ID),
			ShowName:     show.Name,
			EnclosureURL: enclosureURL,
			GUID:         item.GUID,
			PublishedAt:  publishedAt,
			Duration:     duration,
		}
		newItems = append(newItems, newItem)
	}

	return newItems, latestPublishedAt, nil
}

type GetShowReq struct {
	ID int `uri:"id" binding:"required"`
}

type GetShowResp struct {
	Show
}

func (b *Backend) GetShow(ctx context.Context, req *GetShowReq) (*GetShowResp, error) {
	var show *table.PodcastShow
	if err := getTx(ctx).Where("id = ?", req.ID).First(&show).Error; err != nil {
		slog.Error("tx.First() error", "err", err)
		return nil, fmt.Errorf("tx.First() error, err = %w", err)
	}

	resp := &GetShowResp{}
	if err := copier.Copy(&resp, show); err != nil {
		slog.Error("copier.Copy() error", "err", err)
		return nil, fmt.Errorf("copier.Copy() error, err = %w", err)
	}

	return resp, nil
}

type AddShowReq struct {
	Address string `json:"address" binding:"required"`
}

func (r *AddShowReq) Validate(ctx context.Context) error {
	var count int64
	if err := getTx(ctx).Model(&table.PodcastShow{}).
		Where("address = ?", r.Address).Count(&count).Error; err != nil {
		slog.Error("tx.Count() error", "err", err)
		return fmt.Errorf("tx.Count() error, err = %w", err)
	}

	if count > 0 {
		return fmt.Errorf("podcast 已经存在")
	}

	return nil
}

type AddShowResp struct {
}

func (b *Backend) AddShow(ctx context.Context, req *AddShowReq) (*AddShowResp, error) {
	if err := req.Validate(ctx); err != nil {
		return nil, fmt.Errorf("req.Validate() error, err = %w", err)
	}

	fp := gofeed.NewParser()
	feed, err := fp.ParseURLWithContext(req.Address, ctx)
	if err != nil {
		slog.Error("fp.ParseURLWithContext() error", "err", err)
		return nil, fmt.Errorf("fp.ParseURLWithContext() error, err = %w", err)
	}

	var imageURL, imageObjectName string
	if feed.Image != nil {
		imageURL = feed.Image.URL

		var err error
		imageObjectName, err = downloadImage(ctx, imageURL, b.minio)
		if err != nil {
			return nil, fmt.Errorf("downloadImage() error, err = %w", err)
		}
	}

	show := &table.PodcastShow{
		Name:            feed.Title,
		Description:     feed.Description,
		Address:         req.Address,
		ImageURL:        imageURL,
		ImageObjectName: imageObjectName,
	}

	if err := getTx(ctx).Create(show).Error; err != nil {
		slog.Error("tx.Create() error", "err", err)
		return nil, fmt.Errorf("tx.Create() error, err = %w", err)
	}

	return &AddShowResp{}, nil
}

func downloadImage(ctx context.Context, address string, mc *minio.Client) (string, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, address, nil)
	if err != nil {
		slog.Error("http.NewRequestWithContext() error", "err", err)
		return "", fmt.Errorf("http.NewRequestWithContext() error, err = %w", err)
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		slog.Error("http.Get() error", "err", err)
		return "", fmt.Errorf("http.Get() error, err = %w", err)
	}
	defer resp.Body.Close()

	filename := path.Base(resp.Request.URL.Path)
	objectName := getMinioObjectName(filename)
	options := minio.PutObjectOptions{
		ContentType: resp.Header.Get("Content-Type"),
	}
	if _, err := mc.PutObject(ctx, constant.MinioBucketName, objectName, resp.Body, resp.ContentLength, options); err != nil {
		slog.Error("minio.PutObject() error", "err", err)
		return "", fmt.Errorf("minio.PutObject() error, err = %w", err)
	}

	return objectName, nil
}

type DeleteShowReq struct {
	ID int `uri:"id" binding:"required"`
}

type DeleteShowResp struct {
}

func (b *Backend) DeleteShow(ctx context.Context, req *DeleteShowReq) (*DeleteShowResp, error) {
	if err := getTx(ctx).Where("id = ?", req.ID).Delete(&table.PodcastShow{}).Error; err != nil {
		slog.Error("tx.Delete() error", "err", err)
		return nil, fmt.Errorf("tx.Delete() error, err = %w", err)
	}

	if err := getTx(ctx).Where("show_id = ?", req.ID).Delete(&table.PodcastEpisode{}).Error; err != nil {
		slog.Error("tx.Delete() error", "err", err)
		return nil, fmt.Errorf("tx.Delete() error, err = %w", err)
	}

	return &DeleteShowResp{}, nil
}
