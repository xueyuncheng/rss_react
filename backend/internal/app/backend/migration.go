package backend

import (
	"backend/internal/app/backend/table"
	"log/slog"
)

func (b *Backend) migrate() error {
	if err := b.db.DB.AutoMigrate(&table.RSS{}); err != nil {
		slog.Error("b.db.AutoMigrate() error", "err", err)
	}

	return nil
}
