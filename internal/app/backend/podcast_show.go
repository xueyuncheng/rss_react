package backend

import (
	"backend/internal/pkg/table"
	"context"
	"fmt"
	"log/slog"
	"time"

	"github.com/jinzhu/copier"
	"github.com/mmcdole/gofeed"
)

type Show struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Address   string    `json:"address"`
	UpdatedAt time.Time `json:"updated_at"`
	ImageURL  string    `json:"image_url"`
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

	var publishedAt time.Time
	if feed.PublishedParsed != nil {
		publishedAt = *feed.PublishedParsed
	}

	var imageURL string
	if feed.Image != nil {
		imageURL = feed.Image.URL
	}

	show := &table.PodcastShow{
		Name:        feed.Title,
		Address:     req.Address,
		PublishedAt: publishedAt,
		ImageURL:    imageURL,
	}

	if err := getTx(ctx).Create(show).Error; err != nil {
		slog.Error("tx.Create() error", "err", err)
		return nil, fmt.Errorf("tx.Create() error, err = %w", err)
	}

	episodes := make([]*table.PodcastEpisode, 0, len(feed.Items))
	for _, item := range feed.Items {
		var publishedAt time.Time
		if item.PublishedParsed != nil {
			publishedAt = *item.PublishedParsed
		}

		var enclosureURL string
		if item.Enclosures != nil {
			enclosureURL = item.Enclosures[0].URL
		}

		episode := &table.PodcastEpisode{
			Name:         item.Title,
			ShowID:       int(show.ID),
			ShowName:     show.Name,
			EnclosureURL: enclosureURL,
			GUID:         item.GUID,
			PublishedAt:  publishedAt,
		}
		episodes = append(episodes, episode)
	}

	if len(episodes) == 0 {
		return &AddShowResp{}, nil
	}

	if err := getTx(ctx).Create(episodes).Error; err != nil {
		slog.Error("tx.Create() error", "err", err)
		return nil, fmt.Errorf("tx.Create() error, err = %w", err)
	}

	return &AddShowResp{}, nil
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
