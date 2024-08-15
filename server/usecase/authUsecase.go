package usecase

import (
	"errors"
	"fmt"

	"github.com/kriserohalia/company_profile/model"
	"github.com/kriserohalia/company_profile/repository"
	"github.com/kriserohalia/company_profile/util/common"
	"golang.org/x/crypto/bcrypt"
)

type AuthUsecase interface {
	Login(email, password string) (model.TokenModel, error)
	Register(regis model.Register) error
	ResetPassword(oldPassword, newPassword,email string, id int) error
}

type authUsecase struct {
	authrepo repository.AuthRepo
	generatedToken common.JwtUtil
}

// Login implements AuthUsecase.
func (authusecase *authUsecase) Login(email string, password string) (model.TokenModel, error) {

	result,err:= authusecase.authrepo.Login(email)
	if err != nil {
		return model.TokenModel{},err
	}


	if err := bcrypt.CompareHashAndPassword([]byte(result.Password),[]byte(password));err != nil {
		fmt.Println(err.Error())
		return model.TokenModel{}, errors.New("email or password is wrong")

	}

	return authusecase.generatedToken.GenerateToken(result.Id,result.Email,result.Role)
}

// Register implements AuthUsecase.
func (authusecase *authUsecase) Register(regis model.Register) error {

	if regis.Password == " " || len(regis.Password) <= 8 {
		return errors.New("invalid password")
	}

	pass,err := bcrypt.GenerateFromPassword([]byte(regis.Password),10)
	if err !=nil {
		return err
	}

	regis.Password = string(pass)

	if regis.Name == " " ||len(regis.Name) <= 0 {
		return errors.New("invalid name")
	}

	if !regis.IsValidEmail(){
		return errors.New("invalid email")

	}

	return authusecase.authrepo.Register(regis)

}

// ResetPassword implements AuthUsecase.
func (authusecase *authUsecase) ResetPassword(oldPassword,newPassword,email string, id int) error {

	rest, err := authusecase.authrepo.Login(email)
	if err != nil {
		return err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(rest.Password),[]byte(oldPassword));err != nil {
		return errors.New("old password is wrong")
	}

	if oldPassword == newPassword {
		return errors.New("new password must be different with old password")
	}

	hashPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword),10)
	if err != nil {
		return err
	}

	newPassword = string(hashPassword)


	return authusecase.authrepo.ResetPassword(newPassword,id)

	
}

func NewAuthUsecase(authrepo repository.AuthRepo, generatedToken common.JwtUtil) AuthUsecase {
	return &authUsecase{authrepo, generatedToken}

}
