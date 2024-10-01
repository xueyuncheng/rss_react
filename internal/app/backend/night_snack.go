package backend

import (
	"backend/internal/pkg/table"
	"context"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"github.com/jinzhu/copier"
	"github.com/mroth/weightedrand/v2"
	"gorm.io/gorm"
)

type ListNightSnackReq struct {
	Page
}

type ListNightSnackResp struct {
	Total int64         `json:"total"`
	Items []*NightSnack `json:"items"`
}

type NightSnack struct {
	ID     int    `json:"id"`
	Name   string `json:"name"`
	Weight int    `json:"weight"`
}

func (b *Backend) ListNightSnack(ctx context.Context, req *ListNightSnackReq) (*ListNightSnackResp, error) {
	var snacks []*table.NightSnack
	if err := getTx(ctx).Order("id").Offset(req.Offset()).Limit(req.Size).Find(&snacks).Error; err != nil {
		slog.Error("tx.Find() error", "err", err)
		return nil, fmt.Errorf("tx.Find() error, err = %w", err)
	}

	var count int64
	if err := getTx(ctx).Model(&table.NightSnack{}).Count(&count).Error; err != nil {
		slog.Error("tx.Count() error", "err", err)
		return nil, fmt.Errorf("tx.Count() error, err = %w", err)
	}

	respSnacks := make([]*NightSnack, 0, len(snacks))
	if err := copier.Copy(&respSnacks, snacks); err != nil {
		slog.Error("copier.Copy() error", "err", err)
		return nil, fmt.Errorf("copier.Copy() error, err = %w", err)
	}

	resp := &ListNightSnackResp{
		Total: count,
		Items: respSnacks,
	}

	return resp, nil
}

type GetNightSnackReq struct {
	ID int `uri:"id" binding:"required"`
}

type GetNightSnackResp struct {
	NightSnack
}

func (b *Backend) GetNightSnack(ctx context.Context, req *GetNightSnackReq) (*GetNightSnackResp, error) {
	var snack *table.NightSnack
	if err := getTx(ctx).Where("id = ?", req.ID).First(&snack).Error; err != nil {
		slog.Error("tx.First() error", "err", err)
		return nil, fmt.Errorf("tx.First() error, err = %w", err)
	}

	resp := &GetNightSnackResp{}
	if err := copier.Copy(resp, snack); err != nil {
		slog.Error("copier.Copy() error", "err", err)
		return nil, fmt.Errorf("copier.Copy() error, err = %w", err)
	}

	return resp, nil
}

type AddNightSnackReq struct {
	Name   string `json:"name" binding:"required"`
	Weight int    `json:"weight" binding:"required"`
}

type AddNightSnackResp struct {
}

func (b *Backend) AddNightSnack(ctx context.Context, req *AddNightSnackReq) (*AddNightSnackResp, error) {
	snack := &table.NightSnack{
		Name:   req.Name,
		Weight: req.Weight,
	}

	if err := getTx(ctx).Create(snack).Error; err != nil {
		slog.Error("tx.Create() error", "err", err)
		return nil, fmt.Errorf("tx.Create() error, err = %w", err)
	}

	return &AddNightSnackResp{}, nil
}

type UpdateNightSnackReq struct {
	ID     int    `json:"id" binding:"required"`
	Name   string `json:"name" binding:"required"`
	Weight int    `json:"weight" binding:"required"`
}

type UpdateNightSnackResp struct {
}

func (b *Backend) UpdateNightSnack(ctx context.Context, req *UpdateNightSnackReq) (*UpdateNightSnackResp, error) {
	snack := &table.NightSnack{
		Name:   req.Name,
		Weight: req.Weight,
	}
	if err := getTx(ctx).Where("id = ?", req.ID).Updates(snack).Error; err != nil {
		slog.Error("tx.Updates() error", "err", err)
		return nil, fmt.Errorf("tx.Updates() error, err = %w", err)
	}

	return &UpdateNightSnackResp{}, nil
}

type DeleteNightSnackReq struct {
	ID int `uri:"id" binding:"required"`
}

type DeleteNightSnackResp struct {
}

func (b *Backend) DeleteNightSnack(ctx context.Context, req *DeleteNightSnackReq) (*DeleteNightSnackResp, error) {
	if err := getTx(ctx).Where("id = ?", req.ID).Delete(&table.NightSnack{}).Error; err != nil {
		slog.Error("tx.Delete() error", "err", err)
		return nil, fmt.Errorf("tx.Delete() error, err = %w", err)
	}

	return &DeleteNightSnackResp{}, nil
}

type WhatToEatNightSnackReq struct {
}

type WhatToEatNightSnackResp struct {
	NightSnackID   int    `json:"night_snack_id"`
	NightSnackName string `json:"night_snack_name"`
}

func (b *Backend) WhatToEatNightSnack(ctx context.Context, req *WhatToEatNightSnackReq) (*WhatToEatNightSnackResp, error) {
	var choice *table.NightSnackChoice
	if err := getTx(ctx).Where("created_at >= ?", time.Now().Format("2006-01-02 00:00:00")).
		First(&choice).Error; err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {

		slog.Error("tx.First() error", "err", err)
		return nil, fmt.Errorf("tx.First() error, err = %w", err)
	}

	if choice.ID != 0 {
		// 已成生成过夜宵选择了
		resp := &WhatToEatNightSnackResp{
			NightSnackID:   choice.NightSnackID,
			NightSnackName: choice.NightSnackName,
		}

		return resp, nil
	}

	// 还未生成过夜宵选择
	snack, err := generateChoice(ctx)
	if err != nil {
		return nil, fmt.Errorf("generateChoice() error, err = %w", err)
	}

	choice = &table.NightSnackChoice{
		NightSnackID:   int(snack.ID),
		NightSnackName: snack.Name,
	}
	if err := getTx(ctx).Create(choice).Error; err != nil {
		slog.Error("tx.Create() error", "err", err)
		return nil, fmt.Errorf("tx.Create() error, err = %w", err)
	}

	resp := &WhatToEatNightSnackResp{
		NightSnackID:   int(snack.ID),
		NightSnackName: snack.Name,
	}

	return resp, nil
}

func generateChoice(ctx context.Context) (*table.NightSnack, error) {
	var snacks []*table.NightSnack
	if err := getTx(ctx).Find(&snacks).Error; err != nil {
		slog.Error("tx.Find() error", "err", err)
		return nil, fmt.Errorf("tx.Find() error, err = %w", err)
	}

	choices := make([]weightedrand.Choice[*table.NightSnack, int], 0, len(snacks))
	for _, snack := range snacks {
		choice := weightedrand.NewChoice(snack, snack.Weight)
		choices = append(choices, choice)
	}
	chooser, err := weightedrand.NewChooser(choices...)
	if err != nil {
		slog.Error("weightedrand.NewChooser() error", "err", err)
		return nil, fmt.Errorf("weightedrand.NewChooser() error, err = %w", err)
	}

	return chooser.Pick(), nil
}
