package backend

import (
	"backend/internal/pkg/table"
	"context"
	"fmt"
	"log/slog"
)

type AddAssetReq struct {
	Date      string  `json:"date" binding:"required"`
	MoneyYuan float64 `json:"money_yuan" binding:"required"`
}

type AddAssetResp struct {
}

func (b *Backend) AddAsset(ctx context.Context, req *AddAssetReq) (*AddAssetResp, error) {
	asset := &table.Asset{
		Date:      req.Date,
		MoneyYuan: req.MoneyYuan,
	}
	if err := getTx(ctx).Create(asset).Error; err != nil {
		slog.Error("tx.Create() error", "err", err)
		return nil, fmt.Errorf("tx.Create() error, err = %w", err)
	}

	return &AddAssetResp{}, nil
}

type UpdateAssetReq struct {
	ID        int     `json:"id"`
	Date      string  `json:"date"`
	MoneyYuan float64 `json:"money_yuan"`
}

type UpdateAssetResp struct {
}

func (b *Backend) UpdateAsset(ctx context.Context, req *UpdateAssetReq) (*UpdateAssetResp, error) {
	asset := &table.Asset{
		Date:      req.Date,
		MoneyYuan: req.MoneyYuan,
	}
	if err := getTx(ctx).Where("id = ?", req.ID).Updates(asset).Error; err != nil {
		slog.Error("tx.Updates() error", "err", err)
		return nil, fmt.Errorf("tx.Updates() error, err = %w", err)
	}

	return &UpdateAssetResp{}, nil
}

type DeleteAssetReq struct {
	ID int `uri:"id"`
}

type DeleteAssetResp struct {
}

func (b *Backend) DeleteAsset(ctx context.Context, req *DeleteAssetReq) (*DeleteAssetResp, error) {
	if err := getTx(ctx).Where("id = ?", req.ID).Delete(&table.Asset{}).Error; err != nil {
		slog.Error("tx.Delete() error", "err", err)
		return nil, fmt.Errorf("tx.Delete() error, err = %w", err)
	}

	return &DeleteAssetResp{}, nil
}

type Asset struct {
	ID        int     `json:"id"`
	Date      string  `json:"date"`
	MoneyYuan float64 `json:"money_yuan"`
}

type ListAssetReq struct {
	Page
}

type ListAssetResp struct {
	Total int64    `json:"total"`
	Items []*Asset `json:"items"`
}

func (b *Backend) ListAsset(ctx context.Context, req *ListAssetReq) (*ListAssetResp, error) {
	var total int64
	if err := getTx(ctx).Model(&table.Asset{}).Count(&total).Error; err != nil {
		slog.Error("tx.Count() error", "err", err)
		return nil, fmt.Errorf("tx.Count() error, err = %w", err)
	}

	assets := make([]*table.Asset, 0)
	if err := getTx(ctx).Order("date").Offset(req.Offset()).Limit(req.Limit()).Find(&assets).Error; err != nil {
		slog.Error("tx.Find() error", "err", err)
		return nil, fmt.Errorf("tx.Find() error, err = %w", err)
	}

	respAssests := make([]*Asset, 0, len(assets))
	for _, asset := range assets {
		respAssests = append(respAssests, &Asset{
			ID:        int(asset.ID),
			Date:      asset.Date,
			MoneyYuan: asset.MoneyYuan,
		})
	}

	resp := &ListAssetResp{
		Total: total,
		Items: respAssests,
	}

	return resp, nil
}
