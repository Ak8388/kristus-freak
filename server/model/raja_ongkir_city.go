package model

type ResponseProvince struct {
	RajaOngkir RajaOngkir `json:"rajaongkir"`
}

type RajaOngkir struct {
	Query []struct {
		Province string `json:"province"`
	} `json:"query"`
	Status struct {
		Code        uint   `json:"code"`
		Description string `json:"description"`
	} `json:"status"`
	Result []ResultProvince `json:"results"`
}

type ResultProvince struct {
	ProvinceID string `json:"province_id"`
	Province   string `json:"province"`
}

type ResponseCity struct {
	RajaOngkir RajaOngkirCity `json:"rajaongkir"`
}

type RajaOngkirCity struct {
	Query struct {
		Province string `json:"province"`
		Id       string `json:"id"`
	} `json:"query"`
	Status struct {
		Code        uint   `json:"code"`
		Description string `json:"description"`
	} `json:"status"`
	Result []ResultCity `json:"results"`
}

type ResultCity struct {
	CityID     string `json:"city_id"`
	ProvinceID string `json:"province_id"`
	Province   string `json:"province"`
	Type       string `json:"type"`
	CityName   string `json:"city_name"`
	PostCode   string `json:"postal_code"`
}
