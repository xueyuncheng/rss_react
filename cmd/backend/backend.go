package main

import (
	"backend/internal/app/backend"
	"backend/internal/pkg/constant"
	"flag"
	"fmt"
	"log/slog"
	"os"

	"github.com/go-playground/validator/v10"
	"gopkg.in/yaml.v3"
)

func main() {
	file := flag.String("f", "./backend.yaml", "配置文件路径")
	flag.Parse()

	if err := run(*file); err != nil {
		fmt.Printf("run() error, err = %v", err)
		os.Exit(1)
	}
}

func run(file string) error {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{AddSource: true}))
	slog.SetDefault(logger)

	in, err := os.ReadFile(file)
	if err != nil {
		slog.Error("os.ReadFile() error", "err", err)
		return fmt.Errorf("os.ReadFile() error, err = %w", err)
	}

	out := &backend.Config{}
	if err := yaml.Unmarshal(in, out); err != nil {
		slog.Error("yaml.Unmarshal() error", "err", err)
		return fmt.Errorf("yaml.Unmarshal() error, err = %w", err)
	}

	if err := validator.New().Struct(out); err != nil {
		slog.Error("validate.Struct() error", "err", err)
		return fmt.Errorf("validate.Struct() error, err = %w", err)
	}

	if out.Env == constant.EnvDev {
		logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{AddSource: true}))
		slog.SetDefault(logger)
	}

	if err := backend.New(out); err != nil {
		return fmt.Errorf("backend.New() error, err = %w", err)
	}

	return nil
}
