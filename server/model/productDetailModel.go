package model

import (
	"time"
)

type ProductDetail struct {
	Id          int        `json:"id"`
	IdProduk    int        `json:"id_produk"`
	Product     Product    `json:"product"`
	Price       int        `json:"price"`
	Photos      string     `json:"photos"`
	Weight      int        `json:"weight"`
	Stock       int        `json:"stock"`
	Description string     `json:"description"`
	CreatedAt   *time.Time `json:"created_at"`
	UpdatedAt   *time.Time `json:"updated_at"`
	DeletedAt   *time.Time `json:"deleted_at"`
}
