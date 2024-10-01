package backend

import (
	"backend/internal/pkg/table"
	"context"
	"fmt"
	"log/slog"

	"github.com/jinzhu/copier"
)

type Draw struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	Data string `json:"data"`
}

type ListDrawReq struct {
	Page
}

type ListDrawResp struct {
	Total int64   `json:"total"`
	Items []*Draw `json:"items"`
}

func (b *Backend) ListDraw(ctx context.Context, req *ListDrawReq) (*ListDrawResp, error) {
	var draws []*table.Draw
	if err := getTx(ctx).Order("id").Offset(req.Offset()).Limit(req.Size).Find(&draws).Error; err != nil {
		slog.Error("tx.Find() error", "err", err)
		return nil, fmt.Errorf("tx.Find() error, err = %w", err)
	}
	items := make([]*Draw, 0, len(draws))
	if err := copier.Copy(&items, draws); err != nil {
		slog.Error("copier.Copy() error", "err", err)
		return nil, fmt.Errorf("copier.Copy() error, err = %w", err)
	}

	var count int64
	if err := getTx(ctx).Model(&table.Draw{}).Count(&count).Error; err != nil {
		slog.Error("tx.Count() error", "err", err)
		return nil, fmt.Errorf("tx.Count() error, err = %w", err)
	}

	resp := &ListDrawResp{
		Total: count,
		Items: items,
	}
	return resp, nil
}

type GetDrawReq struct {
	ID int `uri:"id"`
}

type GetDrawResp struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	Data string `json:"data"`
}

func (b *Backend) GetDraw(ctx context.Context, req *GetDrawReq) (*GetDrawResp, error) {
	var draw *table.Draw
	if err := getTx(ctx).Where("id = ?", req.ID).First(&draw).Error; err != nil {
		slog.Error("tx.First() error", "err", err)
		return nil, fmt.Errorf("tx.First() error, err = %w", err)
	}

	resp := &GetDrawResp{}
	if err := copier.Copy(resp, draw); err != nil {
		slog.Error("copier.Copy() error", "err", err)
		return nil, fmt.Errorf("copier.Copy() error, err = %w", err)
	}

	return resp, nil
}

type AddDrawReq struct {
	Name string `json:"name"`
	Data string `json:"data"`
}

type AddDrawResp struct {
	ID int `json:"id"`
}

func (b *Backend) AddDraw(ctx context.Context, req *AddDrawReq) (*AddDrawResp, error) {
	draw := &table.Draw{}
	if err := copier.Copy(draw, req); err != nil {
		slog.Error("copier.Copy() error", "err", err)
		return nil, fmt.Errorf("copier.Copy() error, err = %w", err)
	}

	if err := getTx(ctx).Create(draw).Error; err != nil {
		slog.Error("tx.Create() error", "err", err)
		return nil, fmt.Errorf("tx.Create() error, err = %w", err)
	}

	return &AddDrawResp{ID: int(draw.ID)}, nil
}

type UpdateDrawReq struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	Data string `json:"data"`
}

type UpdateDrawResp struct {
}

func (b *Backend) UpdateDraw(ctx context.Context, req *UpdateDrawReq) (*UpdateDrawResp, error) {
	draw := &table.Draw{}
	if err := copier.Copy(draw, req); err != nil {
		slog.Error("copier.Copy() error", "err", err)
		return nil, fmt.Errorf("copier.Copy() error, err = %w", err)
	}

	if err := getTx(ctx).Updates(draw).Error; err != nil {
		slog.Error("tx.Updates() error", "err", err)
		return nil, fmt.Errorf("tx.Updates() error, err = %w", err)
	}

	return &UpdateDrawResp{}, nil
}

type DeleteDrawReq struct {
	ID int `uri:"id"`
}

type DeleteDrawResp struct {
}

func (b *Backend) DeleteDraw(ctx context.Context, req *DeleteDrawReq) (*DeleteDrawResp, error) {
	if err := getTx(ctx).Where("id = ?", req.ID).Delete(&table.Draw{}).Error; err != nil {
		slog.Error("tx.Delete() error", "err", err)
		return nil, fmt.Errorf("tx.Delete() error, err = %w", err)
	}

	return &DeleteDrawResp{}, nil
}
