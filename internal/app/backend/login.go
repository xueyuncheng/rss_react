package backend

import (
	"backend/internal/pkg/jwt"
	"backend/internal/pkg/table"
	"context"
	"fmt"
	"log/slog"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/copier"
)

type User struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type LoginReq struct {
	Name     string `json:"name"`
	Password string `json:"password"`
}

type LoginResp struct {
	User
}

func (b *Backend) Login(ctx context.Context, req *LoginReq) (*LoginResp, error) {
	var user *table.User
	if err := getTx(ctx).Where("name = ?", req.Name).First(&user).Error; err != nil {
		slog.Error("tx.First() error", "err", err)
		return nil, fmt.Errorf("tx.First() error, err = %w", err)
	}

	if user.Password != req.Password {
		return nil, fmt.Errorf("password not match")
	}

	token, err := jwt.NewToken(int(user.ID), user.Name)
	if err != nil {
		slog.Error("jwt.NewToken() error", "err", err)
		return nil, fmt.Errorf("jwt.NewToken() error, err = %w", err)
	}

	ctx.(*gin.Context).SetCookie("Token", token, 24*60*60, "/", "", false, true)

	resp := &LoginResp{}
	if err := copier.Copy(resp, user); err != nil {
		slog.Error("copier.Copy() error", "err", err)
		return nil, fmt.Errorf("copier.Copy() error, err = %w", err)
	}

	return resp, nil
}
