package repository

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
)

type CompanyRepo interface {
	// AddCompany(resp model.Company) error
	UpdateCompany(name, description ,address, email, phone, logo, vision, mision string, Id int) error
	// DeleteCompany(Id int) error
	ListCompany() ([]model.Company, error)
	FindById(id int) (model.Company, error)
}

type companyRepo struct {
	db *sql.DB
}

// AddCompany implements CompanyRepo.
// func (cp *companyRepo) AddCompany(resp model.Company) error {
// 	return erro
// }

// DeleteCompany implements CompanyRepo.
// func (cp *companyRepo) DeleteCompany(Id int) error {
// 	panic("unimplemented")
// }

// FindById implements CompanyRepo.
func (cp *companyRepo) FindById(id int) (resp model.Company, err error) {
	query := "SELECT  * FROM company_profile WHERE id=$1"
	err = cp.db.QueryRow(query,id).Scan(&resp.Id,&resp.Name,&resp.Description,&resp.Address,&resp.Email, &resp.Phone, &resp.Logo,&resp.Vision, &resp.Mision,&resp.CreatedAt, &resp.UpdatedAt, &resp.DeletedAt)

	return
}

// ListCompany implements CompanyRepo.
func (cp *companyRepo) ListCompany() (result []model.Company,err error) {
	query:= "SELECT id,name,description,address,email,phone,logo_url,vision,mission FROM company_profile"
	rows, err := cp.db.Query(query)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next(){
		var resp model.Company
		if err := rows.Scan(&resp.Id,&resp.Name,&resp.Description,&resp.Address,&resp.Email,&resp.Phone,&resp.Logo,&resp.Vision,&resp.Mision);err != nil {
			return nil, err
		}

		result = append(result, resp)
	}
	fmt.Println("ISI : ",result)

	return result, nil
}


// UpdateCompany implements CompanyRepo.
func (cp *companyRepo) UpdateCompany(name, description,address, email, phone, logo, vision, mision string, Id int) error {

	query := "UPDATE company_profile SET name=$1,description=$2,address=$3,email=$4,phone=$5,logo_url=$6,vision=$7,mission=$8, updated_at=$9 WHERE id=$10"
	_, err := cp.db.Exec(query, name,description,address,email,phone,logo,vision,mision, time.Now(), Id)
	return err
}

func NewRepoCompany(db *sql.DB) CompanyRepo {
	return &companyRepo{db}
}
