package encouragement

import (
	"context"
	"os"
	"testing"
)

func TestGenerate(t *testing.T) {
	ctx := context.Background()

	t.Run("empty key returns error", func(t *testing.T) {
		msg, err := Generate(ctx, "", "keep going")
		if err == nil {
			t.Fatalf("expected error for empty api key")
		}
		if msg != "" {
			t.Fatalf("expected empty message, got %q", msg)
		}
	})

	t.Run("integration with real key (optional)", func(t *testing.T) {
		apiKey := os.Getenv("GENAI_API_KEY")
		if apiKey == "" {
			t.Skip("GENAI_API_KEY not set; skipping integration test")
		}
		msg, err := Generate(ctx, apiKey, "Give me a short friendly encouragement message.")
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if len(msg) == 0 {
			t.Fatalf("expected non-empty encouragement message")
		}
	})
}
