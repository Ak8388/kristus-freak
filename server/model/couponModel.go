package model

type CouponModel struct {
	ID       string `json:"id"`
	IdUser   int    `json:"idUser"`
	Code     string `json:"code"`
	Discount int `json:"discount"`
}
