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
		&table.Domain{},
		&table.Investment{},
		&table.Asset{},
		&table.User{},
		&table.NightSnack{},
		&table.NightSnackChoice{},
		&table.PodcastShow{},
		&table.PodcastEpisode{},
	); err != nil {
		slog.Error("b.db.AutoMigrate() error", "err", err)
	}

	return nil
}
