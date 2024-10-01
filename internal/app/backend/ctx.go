package backend

import (
	"context"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

const ctxIsOK = "is_ok"
const ctxTx = "tx"

func (b *Backend) withTx() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		tx := b.db.DB.Begin()

		ctx.Set("tx", tx)
		ctx.Set(ctxIsOK, true)
		ctx.Next()

		if !ctx.Value(ctxIsOK).(bool) {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}
}

func getTx(ctx context.Context) *gorm.DB {
	return ctx.Value(ctxTx).(*gorm.DB)
}
