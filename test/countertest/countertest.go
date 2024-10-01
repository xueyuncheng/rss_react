package main

import (
	"backend/internal/pkg/database"
	"fmt"
	"log/slog"
	"sync"

	"gorm.io/gorm"
)

func main() {
	if err := run(); err != nil {
		panic(err)
	}
}

type Counter struct {
	gorm.Model

	Total int
}

func run() error {
	config := &database.Config{
		Host:     "127.0.0.1",
		Port:     5432,
		Username: "postgres",
		Password: "helloworld",
		DBName:   "rss",
	}
	db, err := database.New(config)
	if err != nil {
		return fmt.Errorf("database.New() error, err = %w", err)
	}

	if err := db.DB.AutoMigrate(&Counter{}); err != nil {
		slog.Error("db.AutoMigrate() error", "err", err)
		return fmt.Errorf("db.AutoMigrate() error, err = %w", err)
	}

	// Insert a counter row
	counter := &Counter{
		Model: gorm.Model{ID: 1},
	}
	if err := db.DB.Save(counter).Error; err != nil {
		slog.Error("db.Create() error", "err", err)
		return fmt.Errorf("db.Create() error, err = %w", err)
	}

	var wg sync.WaitGroup
	for range 1000 {
		wg.Add(1)
		go func() {
			defer wg.Done()

			_ = db.DB.Transaction(func(tx *gorm.DB) error {

				// 锁定要更新的行
				if err := tx.Exec("SELECT total FROM counter WHERE id = 1 FOR UPDATE").Error; err != nil {
					slog.Error("tx.Exec() error", "err", err)
					return fmt.Errorf("tx.Exec() error, err = %w", err)
				}

				// 更新 total 字段
				if err := tx.Exec("UPDATE counter SET total = total + 1 WHERE id = 1 returning *").Error; err != nil {
					slog.Error("tx.Exec() error", "err", err)
					return fmt.Errorf("tx.Exec() error, err = %w", err)
				}

				return nil
			})
		}()
	}

	wg.Wait()

	return nil
}
