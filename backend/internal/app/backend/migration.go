package backend

import (
	"backend/internal/pkg/table"
	"log/slog"
)

func (b *Backend) migrate() error {
	if err := b.db.DB.AutoMigrate(
		&table.RSS{},
		&table.Channel{},
		&table.Story{},
	); err != nil {
		slog.Error("b.db.AutoMigrate() error", "err", err)
	}

	return nil
}
