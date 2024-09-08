package dto

import "github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"

type TransDTO struct {
	Id             int                     `json:"id"`
	DetailTrans    model.DetailTransaction `json:"detailTransaction"`
	ItemDetails    model.ItemDetails       `json:"itemDetails"`
	CustomerDetail model.CustomerDetail    `json:"customerDetail"`
	Status         int                     `json:"status"`
}
