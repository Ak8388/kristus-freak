package usecase

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
	// "github.com/kriserohalia/SI-COMPANY-PROFILE/server/model/dto"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/repository"
)

type ServiceUsecase interface {
	AddService(resp model.Services) error
	UpdateService(name, description string, Id int) error
	DeleteService(Id int) error
	ListService() ([]model.Services, error)
	FindById(id int) (model.Services, error)
}

type serviceUsecase struct {
	r repository.ServiceRepo
}

// AddService implements ServiceUsecase.
func (su *serviceUsecase) AddService(resp model.Services) error {
	space := strings.TrimSpace(resp.Name)
	if space == ""{
		return errors.New("invalid name")
	}

	resp.Name = space

	now := time.Now()
	if resp.CreatedAt == nil {
		resp.CreatedAt = &now
	}


	return su.r.AddService(resp)
}

// DeleteService implements ServiceUsecase.
func (su *serviceUsecase) DeleteService(Id int) error {
	resp, err := su.r.FindById(Id)
	if err != nil {
		return err
	}

	if resp.DeletedAt != nil {
		return errors.New("service is deleted")
	}

	err = su.r.DeleteService(Id)
	if err != nil {
		return err
	}

	return err
}

// FindById implements ServiceUsecase.
func (su *serviceUsecase) FindById(id int) (resp model.Services,err error) {
	resp, err = su.r.FindById(id)
	fmt.Println("cekkkk di uc")
	if resp.Id == 0 {
		return model.Services{}, errors.New("Not found")
	}

	if err != nil {
		return model.Services{}, err

	}
	return
}

// ListService implements ServiceUsecase.
func (su *serviceUsecase) ListService() (resp []model.Services, err error) {
	fmt.Println(resp)
	resp, err = su.r.ListService()
	if len(resp) == 0 {
		return []model.Services{}, errors.New("nothing service")
	}
	if err != nil {
		return []model.Services{},err
	}
	return 
}

// UpdateService implements ServiceUsecase.
func (su *serviceUsecase) UpdateService(name, description string, Id int) error {
	resp, err := su.r.FindById(Id)
	fmt.Println("cekkkk")
	if resp.Id == 0 {
		return errors.New("not found")

	}

	if err!= nil {
		return err
	}

	if resp.DeletedAt != nil {
		return errors.New("data is deleted")
	}

	err = su.r.UpdateService(name, description, Id)
	if err != nil {
		return err
	}

	return err
}

func NewServiceUsecase(r repository.ServiceRepo) ServiceUsecase {
	return &serviceUsecase{r}
}
