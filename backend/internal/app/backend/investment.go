package backend

import (
	"backend/internal/pkg/table"
	"context"
	"fmt"
	"log/slog"
)

type GetInvestmentReq struct {
}

type GetInvestmentResp struct {
	TotalYuan float64                    `json:"total_yuan"`
	Domains   []*GetInvestmentRespDomain `json:"domains"`
}

type GetInvestmentRespDomain struct {
	ID        int                            `json:"id"`
	Name      string                         `json:"name"`
	MoneyYuan float64                        `json:"money_yuan"`
	Percent   float64                        `json:"percent"`
	Items     []*GetInvestmentRespDomainItem `json:"items"`
}

type GetInvestmentRespDomainItem struct {
	ID        int     `json:"id"`
	MoneyYuan float64 `json:"money_yuan"`
}

func (b *Backend) GetInvestment(ctx context.Context, req *GetInvestmentReq) (*GetInvestmentResp, error) {
	var domains []*table.Domain
	if err := getTx(ctx).Find(&domains).Error; err != nil {
		slog.Error("tx.Find() error", "err", err)
		return nil, fmt.Errorf("tx.Find() error, err = %w", err)
	}
	domainIDs := make([]int, 0, len(domains))
	for _, domain := range domains {
		domainIDs = append(domainIDs, int(domain.ID))
	}

	var invests []*table.Investment
	if err := getTx(ctx).Where("domain_id in ?", domainIDs).Find(&invests).Error; err != nil {
		slog.Error("tx.Find() error", "err", err)
		return nil, fmt.Errorf("tx.Find() error, err = %w", err)
	}

	// map[inventment_id] = []inventment
	investMap := make(map[int][]*table.Investment)
	totalYuan := 0.0
	for _, invest := range invests {
		investMap[invest.DomainID] = append(investMap[invest.DomainID], invest)
		totalYuan += invest.MoneyYuan
	}

	domainsResp := make([]*GetInvestmentRespDomain, 0, len(domains))
	for _, domain := range domains {
		items := make([]*GetInvestmentRespDomainItem, 0, len(investMap[int(domain.ID)]))
		domainTotalYuan := 0.0
		for _, invest := range investMap[int(domain.ID)] {
			items = append(items, &GetInvestmentRespDomainItem{
				ID:        int(invest.ID),
				MoneyYuan: invest.MoneyYuan,
			})
			domainTotalYuan += invest.MoneyYuan
		}
		domainsResp = append(domainsResp, &GetInvestmentRespDomain{
			ID:        int(domain.ID),
			Name:      domain.Name,
			MoneyYuan: domainTotalYuan,
			Percent:   domainTotalYuan / totalYuan * 100,
			Items:     items,
		})
	}

	resp := &GetInvestmentResp{
		TotalYuan: totalYuan,
		Domains:   domainsResp,
	}

	return resp, nil
}

type AddInvestmentReq struct {
	DomainID   int     `json:"domain_id" binding:"required"`
	DomainName string  `json:"domain_name" binding:"required"`
	MoneyYuan  float64 `json:"money_yuan" binding:"required"`
}

type AddInvestmentResp struct {
}

func (b *Backend) AddInvestment(ctx context.Context, req *AddInvestmentReq) (*AddInvestmentResp, error) {
	investment := &table.Investment{
		DomainID:   req.DomainID,
		DomainName: req.DomainName,
		MoneyYuan:  req.MoneyYuan,
	}
	if err := getTx(ctx).Create(investment).Error; err != nil {
		slog.Error("tx.Create() error", "err", err)
		return nil, fmt.Errorf("tx.Create() error, err = %w", err)
	}

	return &AddInvestmentResp{}, nil
}

type UpdateInvestmentReq struct {
	ID        int     `json:"id" binding:"required"`
	MoneyYuan float64 `json:"money_yuan" binding:"required"`
}

type UpdateInvestmentResp struct {
}

func (b *Backend) UpdateInvestment(ctx context.Context, req *UpdateInvestmentReq) (*UpdateInvestmentResp, error) {
	investment := &table.Investment{
		MoneyYuan: req.MoneyYuan,
	}
	if err := getTx(ctx).Where("id = ?", req.ID).Updates(investment).Error; err != nil {
		slog.Error("tx.Updates() error", "err", err)
		return nil, fmt.Errorf("tx.Updates() error, err = %w", err)
	}

	return &UpdateInvestmentResp{}, nil
}

type DeleteInvestmentReq struct {
	ID int `uri:"id"`
}

type DeleteInvestmentResp struct {
}

func (b *Backend) DeleteInvestment(ctx context.Context, req *DeleteInvestmentReq) (*DeleteInvestmentResp, error) {
	if err := getTx(ctx).Where("id = ?", req.ID).Delete(&table.Investment{}).Error; err != nil {
		slog.Error("tx.Delete() error", "err", err)
		return nil, fmt.Errorf("tx.Delete() error, err = %w", err)
	}

	return &DeleteInvestmentResp{}, nil
}

type AddDomainReq struct {
	Name string `json:"name"`
}

type AddDomainResp struct {
}

func (b *Backend) AddDomain(ctx context.Context, req *AddDomainReq) (*AddDomainResp, error) {
	domain := &table.Domain{
		Name: req.Name,
	}
	if err := getTx(ctx).Create(domain).Error; err != nil {
		slog.Error("tx.Create() error", "err", err)
		return nil, fmt.Errorf("tx.Create() error, err = %w", err)
	}

	return &AddDomainResp{}, nil
}

type DeleteDomainReq struct {
	ID int `uri:"id"`
}

type DeleteDomainResp struct {
}

func (b *Backend) DeleteDomain(ctx context.Context, req *DeleteDomainReq) (*DeleteDomainResp, error) {
	if err := getTx(ctx).Where("id = ?", req.ID).Delete(&table.Domain{}).Error; err != nil {
		slog.Error("tx.Delete() error", "err", err)
		return nil, fmt.Errorf("tx.Delete() error, err = %w", err)
	}

	return &DeleteDomainResp{}, nil
}

type ListDomainReq struct {
	Page
}

type ListDomainResp struct {
	Total int64                 `json:"total"`
	Items []*ListDomainRespItem `json:"items"`
}

type ListDomainRespItem struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func (b *Backend) ListDomain(ctx context.Context, req *ListDomainReq) (*ListDomainResp, error) {
	var domains []*table.Domain
	if err := getTx(ctx).Offset(req.Offset()).Limit(req.Limit()).Find(&domains).Error; err != nil {
		slog.Error("tx.Find() error", "err", err)
		return nil, fmt.Errorf("tx.Find() error, err = %w", err)
	}

	var count int64
	if err := getTx(ctx).Model(&table.Domain{}).Count(&count).Error; err != nil {
		slog.Error("tx.Count() error", "err", err)
		return nil, fmt.Errorf("tx.Count() error, err = %w", err)
	}

	items := make([]*ListDomainRespItem, 0, len(domains))
	for _, domain := range domains {
		items = append(items, &ListDomainRespItem{
			ID:   int(domain.ID),
			Name: domain.Name,
		})
	}

	resp := &ListDomainResp{
		Total: count,
		Items: items,
	}
	return resp, nil
}

type UpdateDomainReq struct {
	ID   int    `json:"id" binding:"required"`
	Name string `json:"name" binding:"required"`
}

type UpdateDomainResp struct {
}

func (b *Backend) UpdateDomain(ctx context.Context, req *UpdateDomainReq) (*UpdateDomainResp, error) {
	domain := &table.Domain{
		Name: req.Name,
	}
	if err := getTx(ctx).Where("id = ?", req.ID).Updates(domain).Error; err != nil {
		slog.Error("tx.Updates() error", "err", err)
		return nil, fmt.Errorf("tx.Updates() error, err = %w", err)
	}

	return &UpdateDomainResp{}, nil
}
