package model

import "time"

type Product struct {
	Id         int `json:"id"`
	IdCategory int `json:"id_category"`
	Category Category `json:"category"`
	Name       string     `json:"name"`
	CreatedAt  *time.Time `json:"created_at"`
	UpdatedAt  *time.Time `json:"updated_at"`
	DeletedAt  *time.Time `json:"deleted_at"`
}