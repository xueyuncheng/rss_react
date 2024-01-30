package backend

import (
	"backend/internal/app/backend/table"
	"context"
	"fmt"
	"log/slog"

	"github.com/jinzhu/copier"
)

type RSS struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	URL  string `json:"url"`
}

type ListRSSReq struct {
	Page
}

type ListRSSResp struct {
	Total int64  `json:"total"`
	Items []*RSS `json:"items"`
}

func (b *Backend) ListRSS(ctx context.Context, req *ListRSSReq) (*ListRSSResp, error) {
	var total int64
	if err := getTx(ctx).Model(&table.RSS{}).Count(&total).Error; err != nil {
		slog.Error("tx.Count() error", "err", err)
		return nil, fmt.Errorf("tx.Count() error, err = %w", err)
	}

	var rsses []*table.RSS
	if err := getTx(ctx).Order("id").Offset(req.Offset()).Limit(req.Limit()).Find(&rsses).Error; err != nil {
		slog.Error("tx.Find() error", "err", err)
		return nil, fmt.Errorf("tx.Find() error, err = %w", err)
	}

	respRSSes := make([]*RSS, 0, len(rsses))
	if err := copier.Copy(&respRSSes, rsses); err != nil {
		slog.Error("copier.Copy() error", "err", err)
		return nil, fmt.Errorf("copier.Copy() error, err = %w", err)
	}

	resp := &ListRSSResp{
		Total: total,
		Items: respRSSes,
	}

	return resp, nil
}

type GetRSSReq struct {
	ID int `uri:"id"`
}

type GetRSSResp struct {
	RSS
}

func (b *Backend) GetRSS(ctx context.Context, req *GetRSSReq) (*GetRSSResp, error) {
	var rss *table.RSS
	if err := getTx(ctx).Where("id = ?", req.ID).First(&rss).Error; err != nil {
		slog.Error("tx.First() error", "err", err)
		return nil, fmt.Errorf("tx.First() error, err = %w", err)
	}

	resp := &GetRSSResp{}
	if err := copier.Copy(resp, rss); err != nil {
		slog.Error("copier.Copier() error", "err", err)
		return nil, fmt.Errorf("copier.Copy() error, err = %w", err)
	}

	return resp, nil
}

type AddRSSReq struct {
	RSS
}

type AddRSSResp struct {
}

func (b *Backend) AddRSS(ctx context.Context, req *AddRSSReq) (*AddRSSResp, error) {
	rss := &RSS{}
	if err := copier.Copy(rss, req); err != nil {
		slog.Error("copier.Copy() error", "err", err)
		return nil, fmt.Errorf("copier.Copy() error, err = %w", err)
	}

	if err := getTx(ctx).Create(rss).Error; err != nil {
		slog.Error("tx.Create() error", "err", err)
		return nil, fmt.Errorf("tx.Create() error, err = %w", err)
	}

	return &AddRSSResp{}, nil
}

type UpdateRSSReq struct {
	RSS
}

type UpdateRSSResp struct{}

func (b *Backend) UpdateRSS(ctx context.Context, req *UpdateRSSReq) (*UpdateRSSResp, error) {
	rss := &RSS{}
	if err := copier.Copy(rss, &req); err != nil {
		slog.Error("copier.Copy() error", "err", err)
		return nil, fmt.Errorf("copier.Copy() error, err = %w", err)
	}

	if err := getTx(ctx).Where("id = ?", req.ID).Updates(rss).Error; err != nil {
		slog.Error("tx.Updates() error", "err", err)
		return nil, fmt.Errorf("tx.Updates() error, err = %w", err)
	}

	return &UpdateRSSResp{}, nil
}

type DeleteRSSReq struct {
	ID int `uri:"id"`
}

type DeleteRSSResp struct {
}

func (b *Backend) DeleteRSS(ctx context.Context, req *DeleteRSSReq) (*DeleteRSSResp, error) {
	if err := getTx(ctx).Where("id = ?", req.ID).Delete(&table.RSS{}).Error; err != nil {
		slog.Error("tx.Delete() error", "err", err)
		return nil, fmt.Errorf("tx.Delete() error, err = %w", err)
	}

	return &DeleteRSSResp{}, nil
}
