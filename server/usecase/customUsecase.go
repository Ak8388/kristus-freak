package usecase

import (
	"errors"
	"time"

	"github.com/kriserohalia/company_profile/model"
	"github.com/kriserohalia/company_profile/repository"
)

type CustomUsecase interface {
	AddCustom(model.Custom) error
	ListCustom() ([]model.Custom, error)
	FindByIdCustom(Id int) (model.Custom, error)
	DeleteCustom(Id int) error
	UpdateCustom(Id, CategoryName, Qty, IdStatus, EstimateWorkmanship int, Material, Size, Photos, Notes, AddressShipping string) error
}

type customUsecase struct {
	rp repository.CustomRepo
}

// AddCustom implements CustomUsecase.
func (cu *customUsecase) AddCustom(resp model.Custom) error {
    // Validasi
    if resp.CategoryName == 0{
        return errors.New("category_name is required")
    }
    
    if resp.Material == "" {
        return errors.New("material is required")
    }
    
    if resp.Size == "" {
        return errors.New("sizes are required")
    }

    if resp.Photos == "" {
        return errors.New("photos are required")
    }

    if resp.Qty <= 0 {
        return errors.New("quantity must be greater than 0")
    }

    if resp.EstimateWorkmanship <= 0 {
        return errors.New("estimate_workmanship must be greater than 0")
    }

    if resp.AddressShipping == "" {
        return errors.New("address_shipping is required")
    }

    // Pastikan CreatedAt diatur jika belum ada
    now := time.Now()
    if resp.CreatedAt == nil {
        resp.CreatedAt = &now
    }

    // Simpan data setelah validasi berhasil
    return cu.rp.AddCustom(resp)
}
// DeleteCustom implements CustomUsecase.
func (cu *customUsecase) DeleteCustom(Id int) error {
	resp, err := cu.rp.FindByIdCustom(Id)
	if err != nil {
		return err
	}

	if resp.DeletedAt != nil {
		return errors.New("custom  is deleted")
	}

	err = cu.rp.DeleteCustom(Id)
	if err != nil {
		return err
	}

	return err
}

// FindByIdCustom implements CustomUsecase.
func (cu *customUsecase) FindByIdCustom(Id int) (resp model.Custom,err error) {
	resp, err = cu.rp.FindByIdCustom(Id)
	if resp.Id == 0 {
		return model.Custom{}, errors.New("custom is not found")
	}

	if err != nil {
		return model.Custom{}, err
	}

	return
}

// ListCustom implements CustomUsecase.
func (cu *customUsecase) ListCustom() (resp []model.Custom, err error) {
	resp, err = cu.rp.ListCustom()
	if len(resp) == 0 {
		return []model.Custom{}, errors.New("nothing custom created")
	}

	if err != nil {
		return []model.Custom{}, err
	}

	return
}

// UpdateCustom implements CustomUsecase.
func (cu *customUsecase) UpdateCustom(Id int, CategoryName int, Qty int, IdStatus int, EstimateWorkmanship int, Material string, Size string, Photos string, Notes string, AddressShipping string) error {
	resp, err := cu.rp.FindByIdCustom(Id)
	if resp.Id == 0 {
		return errors.New("custom is not found")
	}
	if err != nil {
		return err
	}
	if resp.DeletedAt != nil {
		return errors.New("custom order is deleted")
	}

	err = cu.rp.UpdateCustom(Id,CategoryName,Qty,IdStatus,EstimateWorkmanship,Material,Size,Photos,Notes,AddressShipping)
	if err != nil {
		return err
	}

	return err
}

func NewCustomUsecase(rp repository.CustomRepo) CustomUsecase {
	return &customUsecase{
		rp: rp,
	}
}
