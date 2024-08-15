package usecase

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/repository"
)

type ProductUsecase interface {
	AddProduk(model.Product) error
	FindById(Id int) (model.Product, error)
	ListProduct() ([]model.Product, error)
	UpdateProduct(IdCategory int, Name string, Id int) error
	DeleteProduct(Id int) error
}

type productUsecase struct {
	rp repository.ProdukRepo
}

// AddProduk implements ProductUsecase.
func (pu *productUsecase) AddProduk(resp model.Product) error {
	trimmedName := strings.TrimSpace(resp.Name)
    if trimmedName == "" {
        fmt.Println("CEKKKKCOK! " + resp.Name) // Bisa diganti dengan logger
        return errors.New("invalid name")
    }

    resp.Name = trimmedName

	now := time.Now()
    if resp.CreatedAt == nil {
        resp.CreatedAt = &now
    }
  
    return pu.rp.AddProduk(resp)
}

// DeleteProduct implements ProductUsecase.
func (pu *productUsecase) DeleteProduct(Id int) error {
	resp, err := pu.rp.FindById(Id)
	if err != nil {
		return err
	}

	if resp.DeletedAt != nil {
		return errors.New("product is deleted")
	}

	err = pu.rp.DeleteProduct(Id)
	if err != nil {
		return err
	}

	return err
}

// FindById implements ProductUsecase.
func (pu *productUsecase) FindById(Id int) (resp model.Product, err error) {
    resp, err = pu.rp.FindById(Id)
    if err != nil {
        return model.Product{}, err
    }

    if resp.Id == 0 {
        return model.Product{}, errors.New("product is not found")
    }

    if resp.DeletedAt != nil {
        return model.Product{}, errors.New("product is deleted")
    }

    return resp, nil
}


// ListProduct implements ProductUsecase.
func (pu *productUsecase) ListProduct() (resp []model.Product, err error) {
	allProducts, err := pu.rp.ListProduct()
	if err != nil {
		return []model.Product{}, err
	}

	// Filter produk yang kolom deleted_at-nya kosong
	for _, product := range allProducts {
		if product.DeletedAt == nil {
			resp = append(resp, product)
		}
	}

	if len(resp) == 0 {
		return []model.Product{}, errors.New("no product found")
	}

	return
}


// UpdateProduct implements ProductUsecase.
func (pu *productUsecase) UpdateProduct(IdCategory int, Name string, Id int) error {
	resp, err := pu.rp.FindById(Id)
	if resp.Id == 0 {
		return errors.New("product is not found")
	}
	if err != nil {
		return err
	}
	if resp.DeletedAt != nil {
		return errors.New("product is deleted")
	}

	err = pu.rp.UpdateProduct(IdCategory,Name,Id)
	if err != nil {
		return err
	}

	return err
}

func NewProductUsecase(rp repository.ProdukRepo) ProductUsecase {
	return &productUsecase{rp}
}
