package repository

import (
	"database/sql"
	"time"

	"github.com/kriserohalia/company_profile/model"
)

type ProdukRepo interface {
	AddProduk(model.Product) error
	FindById(Id int) (model.Product, error)
	ListProduct() ([]model.Product, error)
	UpdateProduct(IdCategory int, Name string,Id int) error
	DeleteProduct(Id int) error
}

type productRepo struct {
	db *sql.DB
}

// AddProduk implements ProdukRepo.
func ( pr *productRepo) AddProduk(resp model.Product) error {

	query := "INSERT INTO tb_produk (id_category, name) values ($1,$2)"
	_, err := pr.db.Exec(query,resp.IdCategory, resp.Name)
	return err
}

// DeleteProduct implements ProdukRepo.
func (pr *productRepo) DeleteProduct(Id int) error {
	query := "UPDATE tb_produk SET  updated_at=$1,deleted_at=$2 WHERE id=$3"
	_, err := pr.db.Exec(query, time.Now(), time.Now(), Id)
	return err
}

// FindById implements ProdukRepo.
func (pr *productRepo) FindById(Id int) ( resp model.Product, err error) {
	query := "SELECT * FROM tb_produk WHERE id=$1"
	 err = pr.db.QueryRow(query,Id).Scan(&resp.Id,&resp.IdCategory, &resp.Name,&resp.CreatedAt,&resp.UpdatedAt, &resp.DeletedAt)

	return 
}

// ListProduct implements ProdukRepo.
func (pr *productRepo) ListProduct() (resp []model.Product, err error) {
	query := "SELECT id,id_category, name, created_at,updated_at,deleted_at FROM tb_produk"
	rows, err := pr.db.Query(query)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var cat model.Product
		if err := rows.Scan(&cat.Id,&cat.IdCategory, &cat.Name, &cat.CreatedAt, &cat.UpdatedAt, &cat.DeletedAt); err != nil {
			return nil, err

		}
		resp = append(resp, cat)

	}

	return resp, nil
}

// UpdateProduct implements ProdukRepo.
func (pr *productRepo) UpdateProduct(IdCategory int, Name string,Id int) error {
	query := "UPDATE tb_produk SET id_category=$1,name=$2,updated_at=$3 WHERE id=$4"
	_, err := pr.db.Exec(query,IdCategory, Name, time.Now(), Id)
	return err
}

func NewProductRepo(db *sql.DB) ProdukRepo {
	return &productRepo{
		db: db,
	}
}
