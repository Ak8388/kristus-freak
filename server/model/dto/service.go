package dto

type ServiceDto struct {
	Id          int    `json:"id"`
	Name        string `json:"service_name"`
	Description string `json:"service_description"`
}