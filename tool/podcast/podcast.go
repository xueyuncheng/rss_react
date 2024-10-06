package main

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/mmcdole/gofeed"
)

func main() {
	ctx := context.Background()
	if err := run(ctx); err != nil {
		panic(err)
	}
}

func run(ctx context.Context) error {
	fp := gofeed.NewParser()
	feedURL := "https://podcasts.files.bbci.co.uk/p02nq0gn.rss"
	feed, err := fp.ParseURLWithContext(feedURL, ctx)
	if err != nil {
		slog.Error("fp.ParseURLWithContext() error", "err", err)
		return fmt.Errorf("fp.ParseURLWithContext() error, err = %w", err)
	}

	fmt.Printf("feed: %+v\n", feed)

	return nil
}
