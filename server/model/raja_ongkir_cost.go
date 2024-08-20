package model

type CostRequest struct {
	Origin      string `json:"origin"`
	Destination string `json:"destination"`
	Weight      string `json:"weight"`
	Courier     string `json:"courier"`
}

type ResponseCost struct {
	RajaOngkir RajaOngkirCost `json:"rajaongkir"`
}

type RajaOngkirCost struct {
	Query struct {
		Origin      string `json:"origin"`
		Destination string `json:"destination"`
		Weight      uint   `json:"weight"`
		Courier     string `json:"courier"`
	} `json:"query"`
	Status struct {
		Code        uint   `json:"code"`
		Description string `json:"description"`
	} `json:"status"`

	OriginDetail Details      `json:"origin_details"`
	DestDetail   Details      `json:"destination_details"`
	ResultCost   []ResultCost `json:"results"`
}

type Details struct {
	CityID     string `json:"city_id"`
	ProvinceID string `json:"province_id"`
	Province   string `json:"province"`
	Type       string `json:"type"`
	CityName   string `json:"city_name"`
	PostCode   string `json:"postal_code"`
}

type ResultCost struct {
	Code  string `json:"code"`
	Name  string `json:"name"`
	Costs []struct {
		Service string `json:"service"`
		Des     string `json:"description"`
		Cost    []Cost `json:"cost"`
	} `json:"costs"`
}

type Cost struct {
	Value uint   `json:"value"`
	Etd   string `json:"etd"`
	Note  string `json:"note"`
}
