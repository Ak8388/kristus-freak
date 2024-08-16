package repository

import (
	"database/sql"
	"time"

	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
)

type UserRepo interface {
	FindById(id int) (model.User, error)
	FindUserByEmail(email string) (model.User, error)
	UpdateProfile(name, email string, id int) error
	DeleteUser(id int) error
	List() ([]model.User, error)
}

type userRepo struct {
	db *sql.DB
}

// List implements UserRepo.
func (ur *userRepo) List() (resp []model.User, err error) {
	query := "SELECT id, name, email, role, created_at, updated_at, deleted_at FROM tb_user"
	rows, err := ur.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var user model.User
		if err := rows.Scan(&user.Id, &user.Name, &user.Email, &user.Role, &user.CreatedAt, &user.UpdatedAt, &user.DeletedAt); err != nil {
			return nil, err
		}
		resp = append(resp, user)
	}

	return resp, err

}

// DeleteUser implements UserRepo.
func (ur *userRepo) DeleteUser(id int) error {

	query := "UPDATE tb_user SET updated_at=$1, deleted_at=$2 WHERE id=$3"
	_, err := ur.db.Exec(query, time.Now(), time.Now(), id)
	return err

}

// FindById implements UserRepo.
func (ur *userRepo) FindById(id int) (resp model.User, err error) {
	query := "SELECT  id, name,email,role, created_at,updated_at,deleted_at FROM tb_user WHERE id=$1"
	err = ur.db.QueryRow(query, id).Scan(&resp.Id, &resp.Name, &resp.Email, &resp.Role, &resp.CreatedAt, &resp.UpdatedAt, &resp.DeletedAt)
	return

}

// UpdateProfile implements UserRepo.
func (ur *userRepo) UpdateProfile(name, email string, id int) error {
	query := "UPDATE tb_user SET name=$1, email=$2, updated_at=$3 WHERE id=$4"
	_, err := ur.db.Exec(query, name, email, time.Now(), id)
	return err
}

func (ur *userRepo) FindUserByEmail(email string) (user model.User, err error) {
	qry := "Select id, email, name from tb_user where email=$1"

	err = ur.db.QueryRow(qry, email).Scan(&user.Id, &user.Email, &user.Name)

	return
}

func NewUserRepo(db *sql.DB) UserRepo {
	return &userRepo{db}
}
