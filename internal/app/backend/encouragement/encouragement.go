package encouragement

import (
	"context"
	"fmt"
	"log/slog"

	"google.golang.org/genai"
)

// Generate uses the official go-genai client to produce a short encouragement message.
func Generate(ctx context.Context, apiKey, prompt string) (string, error) {
	if apiKey == "" {
		return "", fmt.Errorf("empty api key")
	}

	clientConfig := &genai.ClientConfig{
		APIKey:  apiKey,
		Backend: genai.BackendGeminiAPI,
	}
	client, err := genai.NewClient(ctx, clientConfig)
	if err != nil {
		slog.Error("genai.NewClient() error", "err", err)
		return "", fmt.Errorf("genai.NewClient() error, err = %w", err)
	}

	model := "gemini-2.0-flash"
	config := &genai.GenerateContentConfig{}
	chat, err := client.Chats.Create(ctx, model, config, nil)
	if err != nil {
		slog.Error("client.Chats.Create() error", "err", err)
		return "", fmt.Errorf("client.Chats.Create() error, err = %w", err)
	}

	part := genai.NewPartFromText(prompt)
	result, err := chat.SendMessage(ctx, *part)
	if err != nil {
		slog.Error("chat.SendMessage() error", "err", err)
		return "", fmt.Errorf("chat.SendMessage() error, err = %w", err)
	}

	return result.Text(), nil
}
