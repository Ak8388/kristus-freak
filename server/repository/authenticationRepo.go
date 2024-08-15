package repository

import (
	"database/sql"
	"time"

	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
)

type AuthRepo interface {
	Login(email string)(model.ResponseLoginRepo, error)
	Register(regis model.Register) error
	ResetPassword(newPassword string, id int)error
}

type authRepo struct {
	db *sql.DB

}

func (auth *authRepo)Login(email string)(resp model.ResponseLoginRepo, err error){
	query := "SELECT id, email, password, role FROM tb_user WHERE email=$1 AND deleted_at IS NULL"
	err = auth.db.QueryRow(query,email).Scan(&resp.Id, &resp.Email, &resp.Password, &resp.Role)

	return 
}


func (auth *authRepo)Register(regis model.Register) error{
	query := "INSERT INTO tb_user (name,email,password,role) values($1,$2,$3,$4)"
	_, err:=  auth.db.Exec(query,regis.Name,regis.Email,regis.Password,regis.Role)
	return err

}

func (auth *authRepo)ResetPassword(newPassword string, id int)error{
	query := "UPDATE tb_user SET password=$1, updated_at=$2 WHERE id=$3"
	_, err := auth.db.Exec(query,newPassword,time.Now(), id)
	return err
}

func NewAuthRepo( db *sql.DB) AuthRepo{
	return &authRepo{db}

} 