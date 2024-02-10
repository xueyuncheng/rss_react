package table

import (
	"time"

	"gorm.io/gorm"
)

type RSS struct {
	gorm.Model

	Name string `json:"name"`
	URL  string `json:"url"`
}

type Channel struct {
	gorm.Model

	Source      string
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

	Title        string
	Link         string
	Description  string
	Guid         string
	PubDate      time.Time
	ChannelID    int
	ChannelTitle string
}
