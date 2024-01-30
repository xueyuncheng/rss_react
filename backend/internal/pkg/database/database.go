package database

import (
	"fmt"
	"log/slog"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

type Config struct {
	File string
}

type Database struct {
	config *Config

	DB *gorm.DB
}

func New(config *Config) (*Database, error) {
	db, err := gorm.Open(sqlite.Open(config.File), &gorm.Config{
		NamingStrategy: schema.NamingStrategy{
			SingularTable: true,
		},
	})
	if err != nil {
		slog.Error("gorm.Open() error", "err", err)
		return nil, fmt.Errorf("gorm.Open() error, err = %w", err)
	}

	database := &Database{
		config: config,
		DB:     db,
	}

	return database, nil
}
