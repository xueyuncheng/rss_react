package backend

import (
	"backend/internal/pkg/constant"
	"backend/internal/pkg/database"
	"fmt"
	"log/slog"
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

	db *database.Database
}

func New(config *Config) error {
	b := &Backend{
		config: config,
	}

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
