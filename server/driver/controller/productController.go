package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kriserohalia/company_profile/driver/middleware"
	"github.com/kriserohalia/company_profile/model"
	"github.com/kriserohalia/company_profile/usecase"
)

type productController struct {
	am middleware.AuthMiddleware
	us usecase.ProductUsecase
	rg *gin.RouterGroup
}

func (cc *productController) addProduct(ctx *gin.Context){
	var resp model.Product

	 if err := ctx.ShouldBindJSON(&resp);err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" :err.Error()})
		return
	 }

	 err := cc.us.AddProduk(resp)
	 if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" :err.Error()})
		return
	 }

	 ctx.JSON(http.StatusOK, gin.H{"message" :"success add product"})

}

func (cc * productController) findById(ctx *gin.Context){
	id:=ctx.Param("id")
	if id == ""{
		ctx.JSON(http.StatusForbidden, gin.H{"message":"product not found"})
		return 
	}

	idInt, err:= strconv.Atoi(id)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" :"invalid product ID"})
	}

	rest, err := cc.us.FindById(idInt)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" :err.Error()})
	}
	ctx.JSON(http.StatusOK,gin.H{"message":"OK", "data" :rest})

}

func (cc * productController) listProduct(ctx *gin.Context){
	rest, err := cc.us.ListProduct()
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" :err.Error()})
	}
	ctx.JSON(http.StatusOK,gin.H{"message":"OK", "data" :rest})

}

func (cc * productController) deleteProduct(ctx *gin.Context){
	id:=ctx.Param("id")
	if id == ""{
		ctx.JSON(http.StatusForbidden, gin.H{"message":"product not found"})
		return 
	}

	idInt, _ := strconv.Atoi(id)
	err := cc.us.DeleteProduct(idInt)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message":err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message":"product deleted"})

}

func (cc * productController) updateProduct(ctx *gin.Context){
	var updateProductReq struct{
		IdCategory int `json:"id_category"`
		Name string `json:"name"`
	}


	if err := ctx.ShouldBindJSON(&updateProductReq);err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message":err.Error()})
		return
	}

	id:=ctx.Param("id")
	if id == ""{
		ctx.JSON(http.StatusForbidden, gin.H{"message":"Product not found"})
		return 
	}

	idInt, _ := strconv.Atoi(id)
	
	 if err:= cc.us.UpdateProduct(updateProductReq.IdCategory,updateProductReq.Name,idInt);err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" : err.Error()})
		return
	 }

	 ctx.JSON(http.StatusOK, gin.H{"message" : " success update product"})


}

func (cc * productController) ProductRouter() {
	r:= cc.rg.Group("product")
	r.GET("/:id",cc.findById)
	r.GET("/list",cc.listProduct)
	r.POST("/add",cc.addProduct)
	r.POST("/delete/:id",cc.deleteProduct)
	r.PUT("/update/:id",cc.updateProduct)
	
}


func NewProductController(am middleware.AuthMiddleware, us usecase.ProductUsecase, rg *gin.RouterGroup) *productController {
	return &productController{
		am: am,
		us: us,
		rg: rg,
	}
}