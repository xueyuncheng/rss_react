package database

import (
	"fmt"
	"log/slog"
	"time"

	"gorm.io/driver/postgres"
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
	dsn := fmt.Sprintf("host=%v port=%v user=%v password=%v dbname=%v sslmode=disable TimeZone=Asia/Shanghai",
		config.Host, config.Port, config.Username, config.Password, config.DBName)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
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
