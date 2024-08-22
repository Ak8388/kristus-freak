package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/driver/middleware"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/usecase"
)

type detailController struct {
	am middleware.AuthMiddleware
	us usecase.DetailUsecase
	rg *gin.RouterGroup
}

func (cc *detailController) add(ctx *gin.Context) {
	var resp model.ProductDetail

	if err := ctx.ShouldBindJSON(&resp); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	err := cc.us.Add(resp)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "success add detail"})

}

func (cc *detailController) findById(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.JSON(http.StatusForbidden, gin.H{"message": "product not found"})
		return
	}

	idInt, err := strconv.Atoi(id)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "invalid product ID"})
	}

	rest, err := cc.us.FindById(idInt)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "OK", "data": rest})

}

func (cc *detailController) listProduct(ctx *gin.Context) {
	rest, err := cc.us.List()
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "OK", "data": rest})

}

func (cc *detailController) deleteProduct(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.JSON(http.StatusForbidden, gin.H{"message": "product not found"})
		return
	}

	idInt, _ := strconv.Atoi(id)
	err := cc.us.Delete(idInt)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "product deleted"})

}

func (cc *detailController) updateProduct(ctx *gin.Context) {
	var updateProductReq struct {
		IdProduk    int    `json:"id_produk"`
		Price       int    `json:"price"`
		Photos      string `json:"photos"`
		Stock       int    `json:"stock"`
		Weight      int    `json:"weight"`
		Description string `json:"description"`
	}

	if err := ctx.ShouldBindJSON(&updateProductReq); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	id := ctx.Param("id")
	if id == "" {
		ctx.JSON(http.StatusForbidden, gin.H{"message": "detail not found"})
		return
	}

	idInt, _ := strconv.Atoi(id)

	if err := cc.us.Update(idInt, updateProductReq.IdProduk, updateProductReq.Price, updateProductReq.Stock, updateProductReq.Weight, updateProductReq.Photos, updateProductReq.Description); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": " success update details"})

}

func (cc *detailController) DetailRouter() {
	r := cc.rg.Group("detail")
	r.GET("/:id", cc.findById)
	r.GET("/list", cc.listProduct)
	r.POST("/add", cc.am.JwtVerified("OWNER"), cc.add)
	r.POST("/delete/:id", cc.deleteProduct)
	r.PUT("/update/:id", cc.am.JwtVerified("OWNER"), cc.updateProduct)

}

func NewDetailController(am middleware.AuthMiddleware, us usecase.DetailUsecase, rg *gin.RouterGroup) *detailController {
	return &detailController{
		am: am,
		us: us,
		rg: rg,
	}
}
