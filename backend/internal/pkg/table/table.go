package table

import (
	"time"

	"gorm.io/gorm"
)

type Channel struct {
	gorm.Model

	Name   string
	Source string

	Title       string
	Link        string
	Description string

	// optional
	Language string
	PubDate  time.Time
	Updated  time.Time
}

type Story struct {
	gorm.Model

	Title       string
	Link        string
	Description string
	Guid        string
	PubDate     time.Time
	ChannelID   int
	ChannelName string
}

type Draw struct {
	gorm.Model

	Name string
	Data string
}
