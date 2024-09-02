package dto

type DtoUpdate struct {
	ID           int    `json:"id"`
	ProdID       int    `json:"prodId"`
	UserID       int    `json:"userId"`
	Qty          int    `json:"qty"`
	CusName      string `json:"cusName"`
	PhoneNumber  string `json:"phoneNumber"`
	AddressShipp string `json:"addressShipping"`
	PostCode     string `json:"postCode"`
}
