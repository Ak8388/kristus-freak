package repository

import (
	"database/sql"
	"time"

	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model/dto"
)

type ServiceRepo interface {
	AddService(resp model.Service) error
	UpdateService(name, description string, Id int) error
	DeleteService(Id int) error
	ListService() ([]dto.ServiceDto, error)
	FindById(id int) (model.Service, error)
}

type serviceRepo struct {
	db *sql.DB
}

// AddService implements ServiceRepo.
func (s *serviceRepo) AddService(resp model.Service) error {
	query := "INSERT INTO service (service_name, service_description) value ($1,$2)"
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
func (s *serviceRepo) FindById(id int) (resp model.Service, err error) {
	query := "SELECT * FROM service WHERE id=$1"
	err = s.db.QueryRow(query,id).Scan(&resp.Id,&resp.Company_id,&resp.Name,&resp.Description,&resp.CreatedAt,&resp.UpdatedAt, &resp.DeletedAt)

	return 
}

// ListService implements ServiceRepo.
func (s *serviceRepo) ListService() (resp []dto.ServiceDto, err error) {
	query := "SELECT id,service_name,service_description FROM service"
	rows, err := s.db.Query(query)
	if err != nil {
		return nil, err
	}	

	defer rows.Close()

	for rows.Next(){
		var ser dto.ServiceDto
		if err := rows.Scan(&ser.Id,&ser.Name, &ser.Description); err != nil {
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
