package model

import "time"

type Product struct {
	Id          int        `json:"id"`
	IdCategory  int        `json:"id_category"`
	Category    Category   `json:"category"`
	Name        string     `json:"name"`
	Price       int        `json:"price"`
	Photos      string     `json:"photos"`
	Weight      any        `json:"weight"`
	Stock       int        `json:"stock"`
	Description string     `json:"description"`
	CreatedAt   *time.Time `json:"created_at"`
	UpdatedAt   *time.Time `json:"updated_at"`
	DeletedAt   *time.Time `json:"deleted_at"`
}
