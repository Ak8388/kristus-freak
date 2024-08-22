package usecase

import (
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/repository"
)

type DeliveryUsecase interface {
	GetProvince() (model.ResponseProvince, error)
	GetCity(key string) (model.ResponseCity, error)
	GetCost(reqData model.CostRequest) (model.ResponseCost, error)
}

type deliveryUsecase struct {
	delivRepo repository.DeliveryRepo
}

func (d *deliveryUsecase) GetProvince() (model.ResponseProvince, error) {
	return d.delivRepo.GetProvince()
}

func (d *deliveryUsecase) GetCity(key string) (model.ResponseCity, error) {
	return d.delivRepo.GetCity(key)
}

func (d *deliveryUsecase) GetCost(reqData model.CostRequest) (model.ResponseCost, error) {
	return d.delivRepo.GetCost(reqData)
}

func NewDeliveryCostUsecase(delivRepo repository.DeliveryRepo) DeliveryUsecase {
	return &deliveryUsecase{delivRepo}
}
