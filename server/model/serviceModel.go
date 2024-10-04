package model

import "time"

type Services struct {
	Id          int        `json:"id"`
	Name        string     `json:"name"`
	Description string     `json:"description"`
	CreatedAt   *time.Time `json:"created_at"`
	UpdatedAt   *time.Time `json:"update_at"`
	DeletedAt   *time.Time `json:"deleted_at"`
	IDCompany int `json:"company_id"`
	Company Company `json:"company"`
}

type ServiceTypes struct {
	Id int `json:"id"`
	ServiceId int `json:"service_id"`
	Service Services `json:"service"`
	Name string `json:"name"`
	CreatedAt   *time.Time `json:"created_at"`
	UpdatedAt   *time.Time `json:"update_at"`
	DeletedAt   *time.Time `json:"deleted_at"`

}

type ServicePrice struct {
	Id int `json:"id"`
	ServiceTypeId ServiceTypes `json:"service_type_id"`
	Description string `json:"description"`
	PriceRange string `json:"price_range"`
	CreatedAt   *time.Time `json:"created_at"`
	UpdatedAt   *time.Time `json:"update_at"`
	DeletedAt   *time.Time `json:"deleted_at"`
}

