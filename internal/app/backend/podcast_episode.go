package backend

import (
	"backend/internal/pkg/table"
	"context"
	"fmt"
	"log/slog"
	"time"

	"github.com/jinzhu/copier"
)

type PodcastEpisode struct {
	ID           int       `json:"id"`
	Name         string    `json:"name"`
	ShowID       int       `json:"show_id"`
	ShowName     string    `json:"show_name"`
	EnclosureURL string    `json:"enclosure_url"`
	GUID         string    `json:"guid"`
	PublishedAt  time.Time `json:"published_at"`
}

type ListPodcastEpisodeReq struct {
	Page

	ShowID int `form:"show_id"`
}

type ListPodcastEpisodeResp struct {
	Total int64             `json:"total"`
	Items []*PodcastEpisode `json:"items"`
}

func (b *Backend) ListPodcastEpisode(ctx context.Context, req *ListPodcastEpisodeReq) (*ListPodcastEpisodeResp, error) {
	cond := &table.PodcastEpisode{
		ShowID: req.ShowID,
	}

	var episodes []*table.PodcastEpisode
	if err := getTx(ctx).Where(cond).Order("published_at desc").
		Offset(req.Offset()).Limit(req.Limit()).Find(&episodes).Error; err != nil {
		slog.Error("tx.Find() error", "err", err)
		return nil, fmt.Errorf("tx.Find() error, err = %w", err)
	}

	var total int64
	if err := getTx(ctx).Model(&table.PodcastEpisode{}).Where(cond).Count(&total).Error; err != nil {
		slog.Error("tx.Count() error", "err", err)
		return nil, fmt.Errorf("tx.Count() error, err = %w", err)
	}

	var items []*PodcastEpisode
	if err := copier.Copy(&items, episodes); err != nil {
		slog.Error("copier.Copy() error", "err", err)
		return nil, fmt.Errorf("copier.Copy() error, err = %w", err)
	}

	resp := &ListPodcastEpisodeResp{
		Total: total,
		Items: items,
	}

	return resp, nil
}
