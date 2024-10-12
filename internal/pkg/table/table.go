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

type Domain struct {
	gorm.Model

	Name string
}

type Investment struct {
	gorm.Model

	MoneyYuan  float64
	DomainID   int
	DomainName string
}

type Asset struct {
	gorm.Model

	Date      string
	MoneyYuan float64
}

type User struct {
	gorm.Model

	Name     string
	Password string
}

type NightSnack struct {
	gorm.Model

	Name   string
	Weight int
}

type NightSnackChoice struct {
	gorm.Model

	NightSnackID   int
	NightSnackName string
}

type PodcastShow struct {
	gorm.Model

	Name            string
	Address         string
	PublishedAt     time.Time
	ImageURL        string
	ImageObjectName string
}

type PodcastEpisode struct {
	gorm.Model

	Name         string
	ShowID       int
	ShowName     string
	EnclosureURL string
	GUID         string
	PublishedAt  time.Time
	Duration     string
}
