package backend

import (
	"backend/internal/pkg/table"
	"context"
	"fmt"
	"log/slog"
	"strconv"
	"strings"
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
	Duration     string    `json:"duration"`
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

	items := make([]*PodcastEpisode, 0, len(episodes))
	for _, episode := range episodes {
		item := &PodcastEpisode{}
		if err := copier.Copy(item, episode); err != nil {
			slog.Error("copier.Copy() error", "err", err)
			return nil, fmt.Errorf("copier.Copy() error, err = %w", err)
		}

		duration, err := parseDuration(episode.Duration)
		if err != nil {
			return nil, fmt.Errorf("parseDuration() error, err = %w", err)
		}
		item.Duration = duration
		items = append(items, item)
	}

	resp := &ListPodcastEpisodeResp{
		Total: total,
		Items: items,
	}

	return resp, nil
}

// parseDuration 解析 iTunes duration 字段并将其转换为秒数
func parseDuration(durationStr string) (string, error) {
	var secondNum int
	parts := strings.Split(durationStr, ":")
	switch len(parts) {
	case 1:
		// 只有秒数
		seconds, err := strconv.Atoi(parts[0])
		if err != nil {
			slog.Error("strconv.Atoi() error", "err", err)
			return "", fmt.Errorf("strconv.Atoi() error, err = %w", err)
		}
		secondNum = seconds
	case 2:
		// MM:SS
		minutes, err := strconv.Atoi(parts[0])
		if err != nil {
			slog.Error("strconv.Atoi() error", "err", err)
			return "", fmt.Errorf("strconv.Atoi() error, err = %w", err)
		}
		seconds, err := strconv.Atoi(parts[1])
		if err != nil {
			slog.Error("strconv.Atoi() error", "err", err)
			return "", fmt.Errorf("strconv.Atoi() error, err = %w", err)
		}
		secondNum = minutes*60 + seconds
	case 3:
		// HH:MM:SS
		hours, err := strconv.Atoi(parts[0])
		if err != nil {
			slog.Error("strconv.Atoi() error", "err", err)
			return "", fmt.Errorf("strconv.Atoi() error, err = %w", err)
		}
		minutes, err := strconv.Atoi(parts[1])
		if err != nil {
			slog.Error("strconv.Atoi() error", "err", err)
			return "", fmt.Errorf("strconv.Atoi() error, err = %w", err)
		}
		seconds, err := strconv.Atoi(parts[2])
		if err != nil {
			slog.Error("strconv.Atoi() error", "err", err)
			return "", fmt.Errorf("strconv.Atoi() error, err = %w", err)
		}
		secondNum = hours*3600 + minutes*60 + seconds
	default:
		slog.Error("invalid duration format", "duration", durationStr)
		return "", fmt.Errorf("invalid duration format: %s", durationStr)
	}

	s := fmt.Sprintf("%vs", secondNum)
	duration, err := time.ParseDuration(s)
	if err != nil {
		slog.Error("time.ParseDuration() error", "err", err)
		return "", fmt.Errorf("time.ParseDuration() error, err = %w", err)
	}

	if duration.Minutes() < 1 {
		return duration.String(), nil
	}

	res := strings.TrimSuffix(duration.Round(time.Minute).String(), "0s")

	return res, nil
}
