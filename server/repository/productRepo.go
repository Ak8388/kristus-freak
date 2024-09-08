package repository

import (
	"database/sql"
	"fmt"
	"strconv"
	"time"

	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
)

type ProdukRepo interface {
	AddProduk(model.Product) error
	FindById(Id int) (model.Product, error)
	ListProduct() ([]model.Product, error)
	UpdateProduct(model.Product) error
	DeleteProduct(Id int) error
	FindByIdUser(Id int) (model.Product, error)
}

type productRepo struct {
	db *sql.DB
}

// AddProduk implements ProdukRepo.
func (pr *productRepo) AddProduk(resp model.Product) error {
	query := "INSERT INTO tb_produk (id_category, name, price, photos, stock, description, weight) values ($1,$2,$3,$4,$5,$6,$7)"
	_, err := pr.db.Exec(query, resp.IdCategory, resp.Name, resp.Price, resp.Photos, resp.Stock, resp.Description, resp.Weight)
	return err
}

// DeleteProduct implements ProdukRepo.
func (pr *productRepo) DeleteProduct(Id int) error {
	query := "UPDATE tb_produk SET  updated_at=$1,deleted_at=$2 WHERE id=$3"
	_, err := pr.db.Exec(query, time.Now(), time.Now(), Id)
	return err
}

// FindById implements ProdukRepo.
func (pr *productRepo) FindById(Id int) (resp model.Product, err error) {
	query := "SELECT * FROM tb_produk WHERE id=$1 AND deleted_at IS NULL"
	err = pr.db.QueryRow(query, Id).Scan(&resp.Id, &resp.IdCategory, &resp.Name, &resp.Price, &resp.Photos, &resp.Stock, &resp.Description, &resp.Weight, &resp.CreatedAt, &resp.UpdatedAt, &resp.DeletedAt)

	return
}

func (pr *productRepo) FindByIdUser(Id int) (resp model.Product, err error) {
	query := "SELECT * FROM tb_produk WHERE id=$1"
	err = pr.db.QueryRow(query, Id).Scan(&resp.Id, &resp.IdCategory, &resp.Name, &resp.Price, &resp.Photos, &resp.Stock, &resp.Description, &resp.Weight, &resp.CreatedAt, &resp.UpdatedAt, &resp.DeletedAt)
	if err == sql.ErrNoRows {
		return model.Product{}, nil
	}
	return
}

// ListProduct implements ProdukRepo.
func (pr *productRepo) ListProduct() (resp []model.Product, err error) {
	query := "SELECT * FROM tb_produk Where deleted_at IS NULL"
	rows, err := pr.db.Query(query)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var cat model.Product

		if err := rows.Scan(&cat.Id, &cat.IdCategory, &cat.Name, &cat.Price, &cat.Photos, &cat.Stock, &cat.Description, &cat.Weight, &cat.CreatedAt, &cat.UpdatedAt, &cat.DeletedAt); err != nil {
			return nil, err
		}

		resp = append(resp, cat)
	}

	return resp, nil
}

// UpdateProduct implements ProdukRepo.
func (pr *productRepo) UpdateProduct(prod model.Product) error {
	query := "UPDATE tb_produk SET id_category=$1,name=$2,price=$3,stock=$4,description=$5,weight=$6,updated_at=$7"
	index := 7
	var data []any
	fmt.Println(prod)
	data = append(data, prod.IdCategory, prod.Name, prod.Price, prod.Stock, prod.Description, prod.Weight, time.Now())

	if prod.Photos != "" {
		index++
		query += ", photos=$" + strconv.Itoa(index)
		data = append(data, prod.Photos)
	}
	index++
	query += " Where id=$" + strconv.Itoa(index)
	data = append(data, prod.Id)

	_, err := pr.db.Exec(query, data...)

	return err
}

func NewProductRepo(db *sql.DB) ProdukRepo {
	return &productRepo{
		db: db,
	}
}
