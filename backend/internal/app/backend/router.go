package backend

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func (b *Backend) route() error {
	r := gin.Default()
	r.Use(cors.Default())
	r.Use(b.withTx())

	api := r.Group("/api")

	channel := api.Group("/channels")
	{
		channel.GET("", wrap(b.ListChannel))
		channel.POST("", wrap(b.AddChannel))
		channel.DELETE("/:id", wrap(b.DeleteChannel))
	}

	story := api.Group("/stories")
	{
		story.GET("", wrap(b.ListStory))
	}

	draw := api.Group("/draws")
	{
		draw.GET("", wrap(b.ListDraw))
		draw.GET("/:id", wrap(b.GetDraw))
		draw.POST("", wrap(b.AddDraw))
		draw.PUT("/:id", wrap(b.UpdateDraw))
		draw.DELETE("/:id", wrap(b.DeleteDraw))
	}

	invest := api.Group("/investments")
	{
		invest.GET("", wrap(b.GetInvestment))
		invest.POST("", wrap(b.AddInvestment))
		invest.DELETE("/:id", wrap(b.DeleteInvestment))
		invest.PUT("/:id", wrap(b.UpdateInvestment))
	}

	domain := api.Group("/domains")
	{
		domain.POST("", wrap(b.AddDomain))
		domain.DELETE("/:id", wrap(b.DeleteDomain))
		domain.GET("", wrap(b.ListDomain))
		domain.PUT("/:id", wrap(b.UpdateDomain))
	}

	asset := api.Group("/assets")
	{
		asset.POST("", wrap(b.AddAsset))
		asset.DELETE("/:id", wrap(b.DeleteAsset))
		asset.PUT("/:id", wrap(b.UpdateAsset))
		asset.GET("", wrap(b.ListAsset))
	}

	slog.Info("http listen addr", "addr", b.config.Addr())
	if err := r.Run(b.config.Addr()); err != nil {
		slog.Error("r.Run() error", "err", err)
		return fmt.Errorf("r.Run() error, err = %w", err)
	}

	return nil
}

type Response struct {
	Err  string `json:"err"`
	Data any    `json:"data"`
}

func wrap[T1, T2 any](f func(context.Context, *T1) (*T2, error)) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		req := new(T1)
		var err error

		// 如果请求体长度不超过2("{}")，并且path的最后一部分segment是以":"开头的，
		// 则可以推断出为 GET /:id 或者 DELETE /:id 这种模式，使用ctx.ShouldBindUri()

		paths := strings.Split(ctx.FullPath(), "/")
		if ctx.Request.ContentLength <= 2 && strings.HasPrefix(paths[len(paths)-1], ":") {

			err = ctx.ShouldBindUri(req)
		} else {
			err = ctx.ShouldBind(req)
		}
		if err != nil {
			slog.Error("ctx.ShouldBind() error", "err", err)
			ctx.JSON(http.StatusOK, Response{Err: err.Error()})
			ctx.Abort()
			return
		}

		resp, err := f(ctx, req)
		if err != nil {
			ctx.Set(ctxIsOK, false)

			ctx.JSON(http.StatusOK, Response{Err: err.Error()})

			ctx.Abort()
			return
		}

		ctx.JSON(http.StatusOK, Response{Data: resp})
	}
}
