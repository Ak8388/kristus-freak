package model

import (
	"time"
)

type Blog struct {
	Id      int    `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
	Author string `json:"author"`
	Cover string `json:"image_url"`
	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at"`
}