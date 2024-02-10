package backend

import (
	"backend/internal/pkg/table"
	"context"
	"errors"
	"fmt"
	"log/slog"
	"slices"
	"time"

	"github.com/jinzhu/copier"
	"github.com/mmcdole/gofeed"
	"gorm.io/gorm"
)

type Channel struct {
	ID          int    `json:"id"`
	Source      string `json:"source"`
	Title       string `json:"title"`
	Link        string `json:"link"`
	Description string `json:"description"`

	// optional
	Language string    `json:"language"`
	PubDate  time.Time `json:"pub_date"`
	Updated  time.Time `json:"updated"`
}

type ListChannelReq struct {
	Page
}

type ListChannelResp struct {
	Total int64      `json:"total"`
	Items []*Channel `json:"items"`
}

func (b *Backend) ListChannel(ctx context.Context, req *ListChannelReq) (*ListChannelResp, error) {
	var chs []*table.Channel
	if err := getTx(ctx).Order("id").Offset(req.Offset()).Limit(req.Size).Find(&chs).Error; err != nil {
		slog.Error("tx.Find() error", "err", err)
		return nil, fmt.Errorf("tx.Find() error, err = %w", err)
	}
	items := make([]*Channel, 0, len(chs))
	if err := copier.Copy(&items, chs); err != nil {
		slog.Error("copier.Copy() error", "err", err)
		return nil, fmt.Errorf("copier.Copy() error, err = %w", err)
	}

	var count int64
	if err := getTx(ctx).Model(&table.Channel{}).Count(&count).Error; err != nil {
		slog.Error("tx.Count() error", "err", err)
		return nil, fmt.Errorf("tx.Count() error, err = %w", err)
	}

	resp := &ListChannelResp{
		Total: count,
		Items: items,
	}

	return resp, nil
}

type AddChannelReq struct {
	Source string `json:"source" binding:"required"`
}

type AddChannelResp struct {
}

func (b *Backend) AddChannel(ctx context.Context, req *AddChannelReq) (*AddChannelResp, error) {
	if err := checkAddChannel(ctx, req); err != nil {
		return nil, fmt.Errorf("checkAddChannel() error, err = %w", err)
	}

	fp := gofeed.NewParser()
	feed, err := fp.ParseURLWithContext(req.Source, ctx)
	if err != nil {
		slog.Error("fp.ParseURLWithContext() error", "err", err)
		return nil, fmt.Errorf("fp.ParseURLWithContext() error, err = %w", err)
	}

	var pubDate time.Time
	if feed.PublishedParsed != nil {
		pubDate = *feed.PublishedParsed
	}

	var updated time.Time
	if feed.UpdatedParsed != nil {
		updated = *feed.UpdatedParsed
	}

	channel := &table.Channel{
		Source:      req.Source,
		Title:       feed.Title,
		Link:        feed.Link,
		Description: feed.Description,
		Language:    feed.Language,
		PubDate:     pubDate,
		Updated:     updated,
	}
	if err := getTx(ctx).Create(channel).Error; err != nil {
		slog.Error("tx.Create() error", "err", err)
		return nil, fmt.Errorf("tx.Create() error, err = %w", err)
	}

	if err := updateChannel(ctx, channel); err != nil {
		return nil, fmt.Errorf("updateChannel() error, err = %w", err)
	}

	return &AddChannelResp{}, nil
}

func checkAddChannel(ctx context.Context, req *AddChannelReq) error {
	var channel *table.Channel
	if err := getTx(ctx).Where("source = ?", req.Source).First(&channel).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}

		slog.Error("tx.First() error", "err", err)
		return fmt.Errorf("tx.First() error, err = %w", err)
	}

	if channel.ID != 0 {
		return fmt.Errorf("channel已存在,请修改后重试")
	}

	return nil
}

type DeleteChannelReq struct {
	ID int `uri:"id"`
}

type DeleteChannelResp struct {
}

func (b *Backend) DeleteChannel(ctx context.Context, req *DeleteChannelReq) (*DeleteChannelResp, error) {
	if err := getTx(ctx).Where("id = ?", req.ID).Delete(&table.Channel{}).Error; err != nil {
		slog.Error("tx.Delete() error", "err", err)
		return nil, fmt.Errorf("tx.Delete() error, err = %w", err)
	}

	if err := getTx(ctx).Where("channel_id = ?", req.ID).Delete(&table.Story{}).Error; err != nil {
		slog.Error("tx.Delete() error", "err", err)
		return nil, fmt.Errorf("tx.Delete() error, err = %w", err)
	}

	return &DeleteChannelResp{}, nil
}

func (b *Backend) bgUpdateStory() {
	tx := b.db.DB.Begin()
	defer tx.Commit()

	ctx := context.WithValue(context.Background(), ctxTx, tx)

	var chs []*table.Channel
	if err := getTx(ctx).Find(&chs).Error; err != nil {
		slog.Error("tx.Find() error", "err", err)
		return
	}

	for _, channel := range chs {
		if err := updateChannel(ctx, channel); err != nil {
			continue
		}
	}
}

func updateChannel(ctx context.Context, channel *table.Channel) error {
	fp := gofeed.NewParser()
	feed, err := fp.ParseURLWithContext(channel.Source, ctx)
	if err != nil {
		slog.Error("fp.ParseURLWithContext() error", "err", err)
		return fmt.Errorf("fp.ParseURLWithContext() error, err = %w", err)
	}

	guids := make([]string, 0, len(feed.Items))
	for _, item := range feed.Items {
		guids = append(guids, item.GUID)
	}

	var hasStories []*table.Story
	if err := getTx(ctx).Where("guid in ?", guids).Find(&hasStories).Error; err != nil {
		slog.Error("tx.Find() error", "err", err)
		return fmt.Errorf("tx.Find() error, err = %w", err)
	}
	hasGuids := make([]string, 0, len(hasStories))
	for _, story := range hasStories {
		hasGuids = append(hasGuids, story.Guid)
	}

	newGuids := make([]string, 0, len(guids))
	for _, guid := range guids {
		if !slices.Contains(hasGuids, guid) {
			newGuids = append(newGuids, guid)
		}
	}

	stories := make([]*table.Story, 0, len(newGuids))
	for _, item := range feed.Items {
		if !slices.Contains(newGuids, item.GUID) {
			continue
		}
		story := &table.Story{
			Title:        item.Title,
			Link:         item.Link,
			Description:  item.Description,
			Guid:         item.GUID,
			PubDate:      *item.PublishedParsed,
			ChannelID:    int(channel.ID),
			ChannelTitle: channel.Title,
		}
		stories = append(stories, story)
	}

	if len(stories) == 0 {
		return nil
	}

	if err := getTx(ctx).Create(stories).Error; err != nil {
		slog.Error("tx.Create() error", "err", err)
		return fmt.Errorf("tx.Create() error, err = %w", err)
	}

	return nil
}
