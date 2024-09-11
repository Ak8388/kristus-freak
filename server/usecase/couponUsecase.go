package usecase

import (
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/repository"
)

type CouponUsecase interface {
	CouponAdd(model.CouponModel) error
	CouponGet(model.CouponModel) ([]model.CouponModel, error)
	CouponUpdate(model.CouponModel) error
	CouponDelete(id string) error
}

type couponUsecase struct {
	couponRepo repository.CouponRepository
}

func (coupon *couponUsecase) CouponAdd(req model.CouponModel) error {
	return coupon.couponRepo.CouponAdd(req)
}

func (coupon *couponUsecase) CouponGet(req model.CouponModel) ([]model.CouponModel, error) {
	return coupon.couponRepo.CouponGet(req)
}

func (coupon *couponUsecase) CouponUpdate(req model.CouponModel) error {
	return coupon.couponRepo.CouponUpdate(req)
}

func (coupon *couponUsecase) CouponDelete(id string) error {
	return coupon.couponRepo.CouponDelete(id)
}

func NewcouponUsecase(repo repository.CouponRepository) CouponUsecase {
	return &couponUsecase{repo}
}
