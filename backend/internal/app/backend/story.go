package backend

import (
	"backend/internal/pkg/table"
	"context"
	"fmt"
	"log/slog"
	"time"

	"github.com/jinzhu/copier"
)

type Story struct {
	ID           int       `json:"id"`
	Title        string    `json:"title"`
	Link         string    `json:"link"`
	Description  string    `json:"description"`
	Guid         string    `json:"guid"`
	PubDate      time.Time `json:"pub_date"`
	ChannelID    int       `json:"channel_id"`
	ChannelTitle string    `json:"channel_title"`
}

type ListStoryReq struct {
	Page

	ChannelID int `form:"channel_id"`
}

type ListStoryResp struct {
	Total int64    `json:"total"`
	Items []*Story `json:"items"`
}

func (b *Backend) ListStory(ctx context.Context, req *ListStoryReq) (*ListStoryResp, error) {
	cond := &table.Story{
		ChannelID: req.ChannelID,
	}
	var stories []*table.Story
	if err := getTx(ctx).Where(cond).
		Order("pub_date desc").Offset(req.Offset()).Limit(req.Size).Find(&stories).Error; err != nil {
		slog.Error("tx.Find() error", "err", err)
		return nil, fmt.Errorf("tx.Find() error, err = %w", err)
	}
	items := make([]*Story, 0, len(stories))
	if err := copier.Copy(&items, stories); err != nil {
		slog.Error("copier.Copy() error", "err", err)
		return nil, fmt.Errorf("copier.Copy() error, err = %w", err)
	}

	var count int64
	if err := getTx(ctx).Model(&table.Story{}).Where(cond).Count(&count).Error; err != nil {
		slog.Error("tx.Count() error", "err", err)
		return nil, fmt.Errorf("tx.Count() error, err = %w", err)
	}

	resp := &ListStoryResp{
		Total: count,
		Items: items,
	}

	return resp, nil
}
