package repository

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
)

type ServiceRepo interface {
	AddService(resp model.Services) error
	UpdateService(name, description string, Id int) error
	DeleteService(Id int) error
	ListService() ([]model.Services, error)
	FindById(id int) (model.Services, error)
}

type serviceRepo struct {
	db *sql.DB
}

// AddService implements ServiceRepo.
func (s *serviceRepo) AddService(resp model.Services) error {
	query := "INSERT INTO service (name,description) value ($1,$2)"
	_, err := s.db.Exec(query, resp.Name, resp.Description)
	return err
}

// DeleteService implements ServiceRepo.
func (s *serviceRepo) DeleteService(Id int) error {
	query := "UPDATE service SET updated_at=$1,deleted_at=$2 WHERE id=$3"
	_, err := s.db.Exec(query, time.Now(),time.Now(),Id)
	return err
}

// FindById implements ServiceRepo.
func (s *serviceRepo) FindById(id int) (resp model.Services, err error) {
	query := "SELECT * FROM service WHERE id=$1"
	err = s.db.QueryRow(query,id).Scan(&resp.Id,&resp.Name,&resp.Description,&resp.CreatedAt,&resp.UpdatedAt, &resp.DeletedAt)

	return 
}

// ListService implements ServiceRepo.
func (s *serviceRepo) ListService() (resp []model.Services, err error) {
	
	query := "SELECT id,name,description,created_at,updated_at,deleted_at FROM services"
	rows, err := s.db.Query(query)
	if err != nil {
		return nil, err
	}	
	fmt.Println("ceekkk",rows)

	defer rows.Close()

	for rows.Next(){
		var ser model.Services
		if err := rows.Scan(&ser.Id,&ser.Name, &ser.Description, &ser.CreatedAt,&ser.UpdatedAt, &ser.DeletedAt); err != nil {
			return nil, err
		}

		resp = append(resp, ser)
	}

	return resp, nil
	
}

// UpdateService implements ServiceRepo.
func (s *serviceRepo) UpdateService(name string, description string, Id int) error {

	query := "UPDATE service SET name=$1,description=$2,updated_at=$3 WHERE id=$4"
	_,err := s.db.Exec(query,name,description,time.Now(),Id)
	return err
}

func NewServiceRepo(db *sql.DB) ServiceRepo {
	return &serviceRepo{db}
}
