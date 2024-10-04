package repository

import (
	"database/sql"
	"time"

	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
)

type CategoryRepo interface {
	AddCategory(resp model.Category) error
	UpdateCategory(name string, Id int) error
	DeleteCategory(Id int) error
	ListCategory() ([]model.Category, error)
	FindById(id int) (model.Category, error)
}

type categoryRepo struct {
	db *sql.DB
}

// FindById implements CategoryRepo.
func (cr *categoryRepo) FindById(id int) (resp model.Category,err error) {
	query := "SELECT * FROM tb_category WHERE id=$1"
	 err = cr.db.QueryRow(query,id).Scan(&resp.Id,&resp.Name,&resp.CreatedAt,&resp.UpdatedAt, &resp.DeletedAt)

	return 
}

// ListCategory implements CategoryRepo.
func (cr *categoryRepo) ListCategory() (resp []model.Category, err error) {
	query := "SELECT id, name, created_at,updated_at,deleted_at FROM tb_category WHERE DELETED_AT IS NULL"
	rows, err := cr.db.Query(query)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var cat model.Category
		if err := rows.Scan(&cat.Id, &cat.Name, &cat.CreatedAt, &cat.UpdatedAt, &cat.DeletedAt); err != nil {
			return nil, err

		}
		resp = append(resp, cat)

	}

	return resp, nil

}

// AddCategory implements CategoryRepo.
func (cr *categoryRepo) AddCategory(resp model.Category) error {
	query := "INSERT INTO tb_category (name) values ($1)"
	_, err := cr.db.Exec(query, resp.Name)
	return err
}

// DeleteCategory implements CategoryRepo.
func (cr *categoryRepo) DeleteCategory(Id int) error {
	query := "UPDATE tb_category SET  updated_at=$1,deleted_at=$2 WHERE id=$3"
	_, err := cr.db.Exec(query, time.Now(), time.Now(), Id)
	return err

}

// UpdateCategory implements CategoryRepo.
func (cr *categoryRepo) UpdateCategory(name string, Id int) error {
	query := "UPDATE tb_category SET name=$1,updated_at=$2 WHERE id=$3"
	_, err := cr.db.Exec(query, name, time.Now(), Id)
	return err

}

func NewCategoryRepo(db *sql.DB) CategoryRepo {
	return &categoryRepo{db}
}
