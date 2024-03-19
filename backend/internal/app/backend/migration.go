package backend

import (
	"backend/internal/pkg/table"
	"log/slog"
)

func (b *Backend) migrate() error {
	if err := b.db.DB.AutoMigrate(
		&table.Channel{},
		&table.Story{},
		&table.Draw{},
	); err != nil {
		slog.Error("b.db.AutoMigrate() error", "err", err)
	}

	return nil
}
