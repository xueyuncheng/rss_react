package backend

import (
	"context"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func (b *Backend) withTx() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		tx := b.db.DB.Begin()

		ctx.Set("tx", tx)
		ctx.Set("is_ok", true)
		ctx.Next()

		if !ctx.Value("is_ok").(bool) {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}
}

func getTx(ctx context.Context) *gorm.DB {
	return ctx.Value("tx").(*gorm.DB)
}
