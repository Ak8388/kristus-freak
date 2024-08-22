package usecase

import (
	"errors"
	"strings"
	"time"

	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model/dto"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/repository"
)

type DetailUsecase interface {
	Add(model.ProductDetail) error
	FindById(Id int) (model.ProductDetail, error)
	List() ([]dto.DetailProductDto, error)
	Delete(Id int) error
	Update(Id, IdProduk, price, stock, weight int, photos, description string) error
}

type detailUsecase struct {
	rp repository.ProductDetailRepo
}

// Add implements DetailUsecase.
func (uc *detailUsecase) Add(resp model.ProductDetail) error {
	// Validasi bahwa Price adalah nilai numerik
	if resp.Price <= 0 {
		return errors.New("invalid price:price must be greater than zero")
	}

	// Validasi dan trim untuk Photos
	trimmedPhotos := strings.TrimSpace(resp.Photos)
	if trimmedPhotos == "" {
		return errors.New("invalid photos: photos cannot be empty")
	}
	resp.Photos = trimmedPhotos

	// Validasi untuk Stock
	if resp.Stock <= 0 {
		return errors.New("invalid stock: stock must be greater than zero")
	}

	// Validasi dan trim untuk Description
	trimmedDescription := strings.TrimSpace(resp.Description)
	if trimmedDescription == "" {
		return errors.New("invalid description: description cannot be empty")
	}
	resp.Description = trimmedDescription

	// Set CreatedAt jika nil
	now := time.Now()
	if resp.CreatedAt == nil {
		resp.CreatedAt = &now
	}

	return uc.rp.Add(resp)
}

// Delete implements DetailUsecase.
func (uc *detailUsecase) Delete(Id int) error {
	resp, err := uc.rp.FindById(Id)
	if err != nil {
		return err
	}

	if resp.DeletedAt != nil {
		return errors.New("detail  is deleted")
	}

	err = uc.rp.Delete(Id)
	if err != nil {
		return err
	}

	return err
}

// FindById implements DetailUsecase.
func (uc *detailUsecase) FindById(Id int) (resp model.ProductDetail, err error) {
	resp, err = uc.rp.FindById(Id)
	if resp.Id == 0 {
		return model.ProductDetail{}, errors.New("product is not found")
	}

	if err != nil {
		return model.ProductDetail{}, err
	}

	return
}

// List implements DetailUsecase.
func (uc *detailUsecase) List() (resp []dto.DetailProductDto, err error) {
	resp, err = uc.rp.List()
	if len(resp) == 0 {
		return []dto.DetailProductDto{}, errors.New("nothing details created")
	}

	if err != nil {
		return []dto.DetailProductDto{}, err
	}

	return
}

// Update implements DetailUsecase.
func (uc *detailUsecase) Update(Id, IdProduk, price, stock, weight int, photos, description string) error {
	resp, err := uc.rp.FindById(Id)
	if resp.Id == 0 {
		return errors.New("details is not found")
	}
	if err != nil {
		return err
	}
	if resp.DeletedAt != nil {
		return errors.New("user account is deleted")
	}

	err = uc.rp.Update(Id, IdProduk, price, stock, weight, photos, description)
	if err != nil {
		return err
	}

	return err
}

func NewDetailUseacase(rp repository.ProductDetailRepo) DetailUsecase {
	return &detailUsecase{
		rp: rp,
	}
}
