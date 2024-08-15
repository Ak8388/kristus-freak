package model

type ResponseCreatePayment struct {
	Token       string `json:"token"`
	RedirectURL string `json:"redirect_url"`
}
