package model

import "time"

type Custom struct {
	Id                  int       `json:"id"`
	CategoryName        int       `json:"category_name"`
	CategoryStruct            Category  `json:"category"`
	Material            string    `json:"material"`
	Size                string    `json:"sizes"`
	Photos              string    `json:"photos"`
	Qty                 int       `json:"qty"`
	Notes               string    `json:"note"`
	IdStatus            int       `json:"id_status"`
	Status              Status    `json:"status"`
	EstimateWorkmanship int       `json:"estimate_workmanship"`
	AddressShipping     string    `json:"address_shipping"`
	CreatedAt           *time.Time `json:"created_at"`
	UpdatedAt           *time.Time `json:"updated_at"`
	DeletedAt           *time.Time `json:"deleted_at"`
}
