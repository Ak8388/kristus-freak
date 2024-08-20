package repository

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/joho/godotenv"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
)

type DeliveryRepo interface {
	GetProvince() (model.ResponseProvince, error)
	GetCity(key string) (model.ResponseCity, error)
	GetCost(reqData model.CostRequest) (model.ResponseCost, error)
}

type deliveryRepo struct {
	db *sql.DB
}

func (d *deliveryRepo) GetProvince() (model.ResponseProvince, error) {
	var data model.ResponseProvince

	if err := godotenv.Load(); err != nil {
		return model.ResponseProvince{}, err
	}
	client := &http.Client{}
	url := "https://api.rajaongkir.com/starter/province"

	req, err := http.NewRequest("GET", url, nil)

	if err != nil {
		return model.ResponseProvince{}, err
	}

	req.Header.Add("key", os.Getenv("API_KEY"))
	res, errRes := client.Do(req)

	if errRes != nil {
		return model.ResponseProvince{}, errRes
	}
	defer res.Body.Close()

	body, _ := io.ReadAll(res.Body)

	if errMarshal := json.Unmarshal(body, &data); errMarshal != nil {
		return model.ResponseProvince{}, err
	}

	return data, nil
}

func (d *deliveryRepo) GetCity(key string) (model.ResponseCity, error) {
	var data model.ResponseCity

	if err := godotenv.Load(); err != nil {
		return data, err
	}

	client := &http.Client{}
	url := fmt.Sprintf("https://api.rajaongkir.com/starter/city?province=%s", key)

	req, err := http.NewRequest("GET", url, nil)

	if err != nil {
		return data, err
	}

	req.Header.Add("key", os.Getenv("API_KEY"))
	res, errRes := client.Do(req)

	if errRes != nil {
		return data, errRes
	}
	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	if err := json.Unmarshal(body, &data); err != nil {
		return data, err
	}

	return data, nil
}

func (d *deliveryRepo) GetCost(reqData model.CostRequest) (model.ResponseCost, error) {
	var data model.ResponseCost

	if err := godotenv.Load(); err != nil {
		return data, err
	}

	client := &http.Client{}
	url := "https://api.rajaongkir.com/starter/cost"

	strPayload := fmt.Sprintf("origin=%s&destination=%s&weight=%s&courier=%s", reqData.Origin, reqData.Destination, reqData.Weight, reqData.Courier)
	payload := strings.NewReader(strPayload)

	req, err := http.NewRequest("POST", url, payload)

	if err != nil {
		return data, err
	}

	req.Header.Add("key", os.Getenv("API_KEY"))
	req.Header.Add("content-type", "application/x-www-form-urlencoded")

	res, errRes := client.Do(req)

	if errRes != nil {
		return data, errRes
	}
	defer res.Body.Close()

	body, _ := io.ReadAll(res.Body)
	if errMarshal := json.Unmarshal(body, &data); errMarshal != nil {
		return data, errMarshal
	}

	return data, nil
}

func NewDeliveryCostRepo(db *sql.DB) DeliveryRepo {
	return &deliveryRepo{db}
}
