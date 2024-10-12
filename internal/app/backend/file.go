package backend

import (
	"backend/internal/pkg/constant"
	"fmt"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/minio/minio-go/v7"
)

func (b *Backend) GetFile(ctx *gin.Context)  {
	if err := getFileHelper(ctx, b.minio); err != nil {
		ctx.JSON(http.StatusOK, Response{Err: err.Error()})
	}
}


func getFileHelper(ctx *gin.Context, mc *minio.Client) error {
	id := ctx.Param("id")
	object, err := mc.GetObject(ctx, constant.MinioBucketName, id, minio.GetObjectOptions{})
	if err != nil {
		slog.Error("mc.GetObject() error", "err", err)
		return fmt.Errorf("mc.GetObject() error, err = %w", err)
	}
	defer object.Close()

	objectStat, err := object.Stat()
	if err != nil {
		slog.Error("object.Stat() error", "err", err)
		return fmt.Errorf("object.Stat() error, err = %w", err)
	}

	ctx.DataFromReader(http.StatusOK, objectStat.Size, objectStat.ContentType, object, nil)

	return nil
}