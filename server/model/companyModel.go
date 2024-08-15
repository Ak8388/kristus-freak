package model

import "time"

type Company struct {
	Id          int        `json:"id"`
	Name        string     `json:"name"`
	Description string     `json:"description"`
	Address     string     `json:"address"`
	Email       string     `json:"email"`
	Phone       string     `json:"phone"`
	Logo        string     `json:"logo_url"`
	Vision      string     `json:"vision"`
	Mision      string     `json:"mision"`
	CreatedAt   *time.Time `json:"created_at"`
	UpdatedAt   *time.Time `json:"updated_at"`
	DeletedAt   *time.Time `json:"deleted_at"`
}