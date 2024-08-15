package usecase

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/repository"
)

type CategoryUseCase interface {
	AddCategory(resp model.Category) error
	UpdateCategory(name string, Id int) error
	DeleteCategory(Id int) error
	ListCategory() ([]model.Category, error)
	FindById(id int) (model.Category, error)
}

type categoryUsecase struct {
	cr repository.CategoryRepo
}

// FindById implements CategoryUseCase.
func (cu *categoryUsecase) FindById(id int) (resp model.Category, err error) {
	resp, err = cu.cr.FindById(id)
	if resp.Id == 0 {
		return model.Category{}, errors.New("user is not found")
	}

	if err != nil {
		return model.Category{}, err
	}

	return
}

// AddCategory implements CategoryUseCase.
func (cu *categoryUsecase) AddCategory(resp model.Category) error {

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
  
    return cu.cr.AddCategory(resp)

}

// DeleteCategory implements CategoryUseCase.
func (cu *categoryUsecase) DeleteCategory(Id int) error {
	resp, err := cu.cr.FindById(Id)
	if err != nil {
		return err
	}

	if resp.DeletedAt != nil {
		return errors.New("category is deleted")
	}

	err = cu.cr.DeleteCategory(Id)
	if err != nil {
		return err
	}

	return err
}

// ListCategory implements CategoryUseCase.
func (cu *categoryUsecase) ListCategory() (resp []model.Category, err error) {
	resp, err = cu.cr.ListCategory()
	if len(resp) == 0 {
		return []model.Category{}, errors.New("not category created")
	}

	if err != nil {
		return []model.Category{}, err
	}

	return
}

// UpdateCategory implements CategoryUseCase.
func (cu *categoryUsecase) UpdateCategory(name string, Id int) error {
	resp, err := cu.cr.FindById(Id)
	if resp.Id == 0 {
		return errors.New("category is not found")
	}
	if err != nil {
		return err
	}
	if resp.DeletedAt != nil {
		return errors.New("user account is deleted")
	}

	err = cu.cr.UpdateCategory(name, Id)
	if err != nil {
		return err
	}

	return err
}

func NewCategoryUsecase(cr repository.CategoryRepo) CategoryUseCase {
	return &categoryUsecase{cr}
}
