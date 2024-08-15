package model

import "time"

type Service struct {
	Id          int        `json:"int"`
	Company_id  int        `json:"company_id"`
	Company Company `json:"company"`
	Name        string     `json:"service_name"`
	Description string     `json:"service_description"`
	CreatedAt   *time.Time `json:"created_at"`
	UpdatedAt   *time.Time `json:"update_at"`
	DeletedAt   *time.Time `json:"deleted_at"`
}