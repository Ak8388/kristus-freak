package usecase

import (
	"errors"

	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/repository"
)

type UserUsecase interface {
	FindById(id int) (model.User, error)
	UpdateProfile(name, email string, id int) error
	DeleteUser(id int) error
	List() ([]model.User, error)
}

type userUsecase struct {
	userepo repository.UserRepo
}

// List implements UserUsecase.
func (uc *userUsecase) List() (resp []model.User, err error) {
	resp, err = uc.userepo.List()
	if len(resp)== 0 {
		return []model.User{}, errors.New("not user created")
	}

	if err != nil {
		return []model.User{}, err
	}

	return
}

// DeleteUser implements UserUsecase.
func (uc *userUsecase) DeleteUser(id int) error {
	result, err := uc.userepo.FindById(id)
	if err != nil {
		return err
	}

	if result.DeletedAt != nil {
		return errors.New("user account is deleted")
	}

	err = uc.userepo.DeleteUser(id)
	if err != nil {
		return err
	}

	return err

}

// FindById implements UserUsecase.
func (uc *userUsecase) FindById(id int) (resp model.User, err error) {
	resp, err = uc.userepo.FindById(id)
	if resp.Id == 0 {
		return model.User{}, errors.New("user is not found")
	}

	if err != nil {
		return model.User{}, err
	}

	return

}

// UpdateProfile implements UserUsecase.
func (uc *userUsecase) UpdateProfile(name string, email string, id int) error {
	resp, err := uc.userepo.FindById(id)
	if resp.Id == 0 {
		return errors.New("user is not found")
	}
	if err != nil {
		return err
	}
	if resp.DeletedAt != nil {
		return errors.New("user account is deleted")
	}

	err = uc.userepo.UpdateProfile(name, email, id)
	if err != nil {
		return err
	}

	return err

}

func NewUserUsecase(userepo repository.UserRepo) UserUsecase {
	return &userUsecase{
		userepo: userepo,
	}
}
