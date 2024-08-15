package repository

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"github.com/kriserohalia/company_profile/model"
	dto "github.com/kriserohalia/company_profile/model/Dto"
)

type ProductDetailRepo interface {
	Add(model.ProductDetail) error
	FindById(Id int) (model.ProductDetail, error)
	List() ([]dto.DetailProductDto, error)
	Delete(Id int) error
	Update(Id, IdCategory ,price,stock int, photos, description string) error
}

type productDetailRepo struct {
	db *sql.DB
}

// Add implements ProductDetailRepo.
func (pd *productDetailRepo) Add(resp model.ProductDetail) error {
    query := "INSERT INTO tb_produk_detail (id_produk, price, photos, stock, description, created_at) VALUES ($1, $2, $3, $4, $5, $6)"
    _, err := pd.db.Exec(query, resp.IdProduk, resp.Price, resp.Photos, resp.Stock, resp.Description, resp.CreatedAt)
    return err
}


// Delete implements ProductDetailRepo.
func (pd *productDetailRepo) Delete(Id int) error {
	query := "UPDATE tb_produk_detail SET  updated_at=$1,deleted_at=$2 WHERE id=$3"
	_, err := pd.db.Exec(query, time.Now(), time.Now(), Id)
	return err
}

// FindById implements ProductDetailRepo.
func (pd *productDetailRepo) FindById(Id int) (resp model.ProductDetail, err error) {
	query := "SELECT * FROM tb_produk_detail WHERE id=$1"
	 err = pd.db.QueryRow(query,Id).Scan(&resp.Id,&resp.IdProduk,&resp.Price,&resp.Photos,&resp.Stock,&resp.Description, &resp.CreatedAt,&resp.UpdatedAt, &resp.DeletedAt)

	return 
}

// List implements ProductDetailRepo.
func (pd *productDetailRepo) List() (resp []dto.DetailProductDto, err error) {
    query := `
        SELECT pd.id, pd.id_produk, pd.price, pd.photos, pd.stock, pd.description, 
               p.id_category, p.name, c.name 
        FROM tb_produk_detail pd 
        JOIN tb_produk p ON pd.id_produk = p.id 
        JOIN tb_category c ON p.id_category = c.id
    `
    rows, err := pd.db.Query(query)
    if err != nil {
        fmt.Println(err)
        return nil, fmt.Errorf("error querying the database: %v", err)
    }
    defer rows.Close()

    for rows.Next() {
        var detail dto.DetailProductDto
        err := rows.Scan(
            &detail.Id, 
            &detail.IdProduk,
            &detail.Price, 
            &detail.Photos, 
            &detail.Stock, 
            &detail.Description,
            &detail.ProductDto.IdCategory, 
            &detail.ProductDto.Name, 
            &detail.ProductDto.CategoryDto.Name,
        )
        if err != nil {
            return nil, fmt.Errorf("error scanning row: %v", err)
        }
        resp = append(resp, detail)
        fmt.Println("ISINYA:", detail)
    }

    if err = rows.Err(); err != nil {
        return nil, fmt.Errorf("error after iterating rows: %v", err)
    }
	if len(resp) == 0 {
        // Handle case when no details are found
        emptyResponse := map[string]interface{}{
            "message": "nothing details created",
            "data":    []dto.DetailProductDto{},
        }
        emptyResponseJSON, _ := json.Marshal(emptyResponse)
        fmt.Println(string(emptyResponseJSON))
        return nil, nil // Or return an appropriate error/message
    }

    return resp, nil
}

// Update implements ProductDetailRepo.
func (pd *productDetailRepo) Update(Id, IdProduk ,price,stock int, photos, description string) error {
	query := "UPDATE tb_produk_detail SET id_produk=$1,price=$2,photos=$3,stock=$4,description=$5,updated_at=$6 WHERE id=$7"
	_, err := pd.db.Exec(query,IdProduk,price,photos,stock,description,time.Now(),Id)
	return err
}

func NewProductDetail(db *sql.DB) ProductDetailRepo {
	return &productDetailRepo{db: db}
}
