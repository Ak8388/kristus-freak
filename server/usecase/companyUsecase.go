package usecase

import (
	"errors"

	"github.com/kriserohalia/company_profile/model"
	"github.com/kriserohalia/company_profile/repository"
)

type CompanyUsecase interface {
	// AddCompany(resp model.Company) error
	UpdateCompany(name, description,address, email, phone , logo , vision , mision string, Id int) error
	// DeleteCompany(Id int) error
	ListCompany() ([]model.Company, error)
	FindById(id int) (model.Company, error)
}

type companyUsecase struct {
	cr repository.CompanyRepo
}

// AddCompany implements CompanyUsecase.
// func (cus *companyUsecase) AddCompany(resp model.Company) error {
// 	panic("unimplemented")
// }

// DeleteCompany implements CompanyUsecase.
// func (cus *companyUsecase) DeleteCompany(Id int) error {
// 	panic("unimplemented")
// }

// FindById implements CompanyUsecase.
func (cus *companyUsecase) FindById(id int) (resp model.Company, err error) {
	resp, err = cus.cr.FindById(id)
	if resp.Id == 0 {
		return model.Company{}, errors.New("user is not found")
	}

	if err != nil {
		return model.Company{}, err
	}

	return
}

// ListCompany implements CompanyUsecase.
func (cus *companyUsecase) ListCompany() (resp []model.Company, err error) {
	resp, err = cus.cr.ListCompany()
	if len(resp) == 0 {
		return []model.Company{}, errors.New("nothing profile created")
	}

	if err != nil {
		return []model.Company{}, err
	}

	return
}

// UpdateCompany implements CompanyUsecase.
func (cus *companyUsecase) UpdateCompany(name string, description string, address string, email string, phone string, logo string, vision string, mision string, Id int) error {
	resp, err := cus.cr.FindById(Id)
	if resp.Id == 0 {
		return errors.New("profile is not found")
	}
	if err != nil {
		return err
	}
	if resp.DeletedAt != nil {
		return errors.New("profile at is deleted")
	}

	err = cus.cr.UpdateCompany(name,description,address,email,phone,logo,vision,mision, Id)
	if err != nil {
		return err
	}

	return err
}

func NewUsecaseCompany(cr repository.CompanyRepo) CompanyUsecase {
	return &companyUsecase{cr}
}
