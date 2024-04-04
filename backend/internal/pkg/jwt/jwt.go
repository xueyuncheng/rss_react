package jwt

import (
	"fmt"
	"log/slog"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const (
	issuer       = "test-issuer"
	mySigningKey = "test-key"
)

type MyCustomClaims struct {
	jwt.RegisteredClaims

	ID   int    `json:"id"`
	Name string `json:"name"`
}

func NewToken(id int, name string) (string, error) {
	now := time.Now()
	claims := MyCustomClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    issuer,
			Subject:   "",
			Audience:  []string{},
			ExpiresAt: jwt.NewNumericDate(now.Add(24 * time.Hour)),
			NotBefore: jwt.NewNumericDate(now),
			IssuedAt:  jwt.NewNumericDate(now),
		},
		ID:   id,
		Name: name,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(mySigningKey))
}

func ParseToken(tokenString string) (*MyCustomClaims, error) {
	claims := &MyCustomClaims{}
	keyFunc := func(token *jwt.Token) (any, error) {
		return []byte(mySigningKey), nil
	}

	if _, err := jwt.ParseWithClaims(tokenString, claims, keyFunc); err != nil {
		slog.Error("jwt.ParseWithClaims() error", "err", err)
		return nil, fmt.Errorf("jwt.ParseWithClaims() error, err = %w", err)
	}

	return claims, nil
}
