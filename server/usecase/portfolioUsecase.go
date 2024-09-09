package usecase

import (
	"errors"
	"time"

	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/repository"
)

type PortfolioUsecase interface {
	Add(model.Portfolio) error
	FindById(Id int) (model.Portfolio, error)
	List() ([]model.Portfolio, error)
	Delete(Id int) error
	Update(Id int, ProjectName, ProjectDescription, ProjectImage, ProjectDate string) error
}

type portfolioUsecase struct {
	p repository.PortfolioRepo
}

// AddPortfolio implements PortfolioUsecase.
func (pu *portfolioUsecase) Add(resp model.Portfolio) error {

	now := time.Now()
	if resp.CreatedAt == nil {
		resp.CreatedAt = &now
	}
	return pu.p.AddPortfolio(resp)
}

// Delete implements PortfolioUsecase.
func (pu *portfolioUsecase) Delete(Id int) error {
	resp, err := pu.p.FindById(Id)
	if err != nil {
		return err
	}

	if resp.DeletedAt != nil {
		return errors.New("data is deleted")
	}

	err = pu.p.Delete(Id)
	if err != nil {
		return err
	}

	return err
}

// FindById implements PortfolioUsecase.
func (pu *portfolioUsecase) FindById(Id int) (resp model.Portfolio, err error) {
	resp, err = pu.p.FindById(Id)
	if resp.Id == 0 {
		return model.Portfolio{}, errors.New("product is not found")
	}

	if err != nil {
		return model.Portfolio{}, err
	}

	return
}

// List implements PortfolioUsecase.
func (pu *portfolioUsecase) List() (resp []model.Portfolio, err error) {
	resp, err = pu.p.List()
	if len(resp) == 0 {
		return []model.Portfolio{}, errors.New("nothing data created")
	}

	if err != nil {
		return []model.Portfolio{}, err
	}

	return
}

// Update implements PortfolioUsecase.
func (pu *portfolioUsecase) Update(Id int, ProjectName string, ProjectDescription string, ProjectImage string, ProjectDate string) error {
	resp, err := pu.p.FindById(Id)
	if resp.Id == 0 {
		return errors.New("data is not found")
	}

	if err != nil {
		return err
	}

	if resp.DeletedAt != nil {
		return errors.New("data is deleted")
	}

	err = pu.p.Update(Id, ProjectName, ProjectDescription, ProjectImage, ProjectDate)
	if err != nil {
		return err
	}

	return err
}

func NewPortfolioUsecase(p repository.PortfolioRepo) PortfolioUsecase {
	return &portfolioUsecase{p: p}
}
