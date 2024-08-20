package dto

type CategoryDto struct {
	Name string `json:"name"`
}

type ProductDto struct {
	IdCategory  int         `json:"id_category"`
	Name        string      `json:"name"`
	CategoryDto CategoryDto `json:"category_dto"`
}

type DetailProductDto struct {
	Id          int        `json:"id"`
	IdProduk    int        `json:"id_produk"`
	ProductDto  ProductDto `json:"produk_dto"`
	Price       int        `json:"price"`
	Photos      string     `json:"photos"`
	Weight      int        `json:"weight"`
	Stock       int        `json:"stock"`
	Description string     `json:"description"`
}
