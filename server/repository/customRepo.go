package repository

import (
	"database/sql"
	"time"

	"github.com/kriserohalia/company_profile/model"
)

type CustomRepo interface {
	AddCustom(model.Custom) error
	ListCustom() ([]model.Custom, error)
	FindByIdCustom(Id int) (model.Custom, error)
	DeleteCustom(Id int) error
	UpdateCustom(Id,CategoryName, Qty, IdStatus, EstimateWorkmanship int, Material, Size, Photos, Notes, AddressShipping string) error
}

type customRepo struct {
	db *sql.DB
}

// AddCustom implements CustomRepo.
func (cr *customRepo) AddCustom(resp model.Custom) error {
	query := "INSERT INTO tb_custom (category,material,sizes,photos,qty,note,id_status,estimate_workmanship,address_shipping) values ($1,$2,$3,$4,$5,$6,$7,$8,$9)"
	_, err := cr.db.Exec(query,resp.CategoryName,resp.Material,resp.Size,resp.Photos,resp.Qty, resp.Notes,resp.IdStatus,resp.EstimateWorkmanship,resp.AddressShipping)
	return err
}

// DeleteCustom implements CustomRepo.
func (cr *customRepo) DeleteCustom(Id int) error {
	query := "UPDATE tb_custom SET  updated_at=$1,deleted_at=$2 WHERE id=$3"
	_, err := cr.db.Exec(query, time.Now(), time.Now(), Id)
	return err
}

// FindByIdCustom implements CustomRepo.
func (cr *customRepo) FindByIdCustom(Id int) (resp model.Custom, err error) {
	query := "SELECT * FROM tb_custom WHERE id=$1"
	 err = cr.db.QueryRow(query,Id).Scan(&resp.CategoryName,&resp.Material, &resp.Size, &resp.Photos, &resp.Qty, &resp.Notes, &resp.IdStatus, &resp.EstimateWorkmanship, &resp.AddressShipping, &resp.CreatedAt)
	 return 

}

// ListCustom implements CustomRepo.
func (cr *customRepo) ListCustom() (result []model.Custom, err error) {
	query := "SELECT * FROM tb_custom"
	rows, err := cr.db.Query(query)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var resp model.Custom
		if err := rows.Scan(&resp.CategoryName,&resp.Material, &resp.Size, &resp.Photos, &resp.Qty, &resp.Notes, &resp.IdStatus, &resp.EstimateWorkmanship, &resp.AddressShipping, &resp.CreatedAt); err != nil {
			return nil, err

		}
		result = append(result, resp)

	}

	return result, nil
}

// UpdateCustom implements CustomRepo.
func (cr *customRepo) UpdateCustom(Id, CategoryName int, Qty int, IdStatus int, EstimateWorkmanship int, Material string, Size string, Photos string, Notes string, AddressShipping string) error {
	query := "UPDATE tb_custom SET category= $1 ,material=$2,size= $3,photos=$4,qty=$5,note=$6,id_status=$7,estimate_workmanship=$8,address_shipping=$9, updated_at=10 WHERE id=$11"
	_, err := cr.db.Exec(query,CategoryName,Material,Size,Photos,Qty,Notes,IdStatus,EstimateWorkmanship,AddressShipping,time.Now(),Id)
	return err
}

func NewCustomRepo(db *sql.DB) CustomRepo {
	return &customRepo{db}
}
