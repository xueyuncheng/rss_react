package backend

import (
	"backend/internal/pkg/constant"
	"backend/internal/pkg/database"
	"context"
	"fmt"
	"log/slog"
	"net"
	"sync/atomic"

	"github.com/minio/minio-go/v7/pkg/credentials"

	"github.com/minio/minio-go/v7"
	"github.com/robfig/cron/v3"
)

type Config struct {
	Env  constant.Env `yaml:"env" validate:"required"`
	Port string       `yaml:"port" validate:"required"`

	Database *database.Config `yaml:"database" validate:"required"`
	Minio    *MinioConfig     `yaml:"minio" validate:"required"`
}

type MinioConfig struct {
	Endpoint        string `yaml:"endpoint" validate:"required"`
	AccessKeyID     string `yaml:"access_key_id" validate:"required"`
	SecretAccessKey string `yaml:"secret_access_key" validate:"required"`
}

func (c *Config) Addr() string {
	return net.JoinHostPort("0.0.0.0", c.Port)
}

type Backend struct {
	config *Config

	db                  *database.Database
	minio               *minio.Client
	cron                *cron.Cron
	isPodcastRefreshing atomic.Bool
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

	minio, err := newMinio(config.Minio)
	if err != nil {
		return fmt.Errorf("newMinio() error, err = %w", err)
	}
	b.minio = minio

	b.migrate()
	b.route()

	return nil
}

func newMinio(config *MinioConfig) (*minio.Client, error) {
	options := &minio.Options{
		Creds:  credentials.NewStaticV4(config.AccessKeyID, config.SecretAccessKey, ""),
		Secure: false,
	}

	client, err := minio.New(config.Endpoint, options)
	if err != nil {
		slog.Error("minio.New() error", "err", err)
		return nil, fmt.Errorf("minio.New() error, err = %w", err)
	}

	if err := makeBucketIfNotExists(context.Background(), client); err != nil {
		return nil, fmt.Errorf("makeBucketIfNotExists() error, err = %w", err)
	}

	return client, nil
}

func makeBucketIfNotExists(ctx context.Context, client *minio.Client) error {
	exists, err := client.BucketExists(ctx, constant.MinioBucketName)
	if err != nil {
		slog.Error("client.BucketExists() error", "err", err)
		return fmt.Errorf("client.BucketExists() error, err = %w", err)
	}

	if !exists {
		if err := client.MakeBucket(ctx, constant.MinioBucketName, minio.MakeBucketOptions{}); err != nil {
			slog.Error("client.MakeBucket() error", "err", err)
			return fmt.Errorf("client.MakeBucket() error, err = %w", err)
		}
	}

	return nil
}
