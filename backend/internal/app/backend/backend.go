package backend

import (
	"backend/internal/pkg/constant"
	"backend/internal/pkg/database"
	"fmt"
	"log/slog"

	"github.com/robfig/cron/v3"
)

type Config struct {
	Env  constant.Env `yaml:"env" validate:"required"`
	Port string       `yaml:"port" validate:"required"`

	Database *database.Config `yaml:"database" validate:"required"`
}

func (c *Config) Addr() string {
	return fmt.Sprintf("0.0.0.0:%v", c.Port)
}

type Backend struct {
	config *Config

	db   *database.Database
	cron *cron.Cron
}

func New(config *Config) error {
	b := &Backend{
		config: config,
		cron:   cron.New(),
	}

	// run at every 5 minute
	// if _, err := b.cron.AddFunc("*/5 * * * *", b.bgUpdateStory); err != nil {
	// 	slog.Error("cron.AddFunc() error", "err", err)
	// 	return fmt.Errorf("cron.AddFunc() error, err = %w", err)
	// }
	b.cron.Start()

	db, err := database.New(config.Database)
	if err != nil {
		slog.Error("database.New() error", "err", err)
		return fmt.Errorf("database.New() error, err = %w", err)
	}
	b.db = db

	b.migrate()
	b.route()

	return nil
}
