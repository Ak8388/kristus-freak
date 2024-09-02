package model

import "time"

type Portfolio struct {
	Id                 int        `json:"id"`
	IdService          int        `json:"service_id"`
	Services           Services   `json:"service"`
	ProjectName        string     `json:"project_name"`
	ProjectDescription string     `json:"project_description"`
	ProjectImage string `json:"project_image"`
	ProjectDate        string    `json:"project_date"`
	CreatedAt          *time.Time `json:"created_at"`
	UpdatedAt          *time.Time `json:"updated_at"`
	DeletedAt          *time.Time `json:"deleted_at"`
}