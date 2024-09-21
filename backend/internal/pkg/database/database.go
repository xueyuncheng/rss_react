package database

import (
	"fmt"
	"log/slog"
	"time"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

type Config struct {
	Host     string `yaml:"host"`
	Port     int    `yaml:"port"`
	Username string `yaml:"username"`
	Password string `yaml:"password"`
	DBName   string `yaml:"db_name"`
}

type Database struct {
	config *Config

	DB *gorm.DB
}

func New(config *Config) (*Database, error) {
	db, err := gorm.Open(sqlite.Open("gorm.db"), &gorm.Config{
		NamingStrategy: schema.NamingStrategy{
			SingularTable: true,
		},
	})
	if err != nil {
		slog.Error("gorm.Open() error", "err", err)
		return nil, fmt.Errorf("gorm.Open() error, err = %w", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		slog.Error("db.DB() error", "err", err)
		return nil, fmt.Errorf("db.DB() error, err = %w", err)
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	database := &Database{
		config: config,
		DB:     db,
	}

	return database, nil
}
