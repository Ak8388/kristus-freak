package controller

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/driver/middleware"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/usecase"
)

type productController struct {
	am middleware.AuthMiddleware
	us usecase.ProductUsecase
	rg *gin.RouterGroup
}

func (cc *productController) addProduct(ctx *gin.Context) {
	_, header, err := ctx.Request.FormFile("photos")
	var fileLocation string

	if err != nil {
		if err != http.ErrMissingFile {
			fmt.Println(err.Error())
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "failed get data from form"})
			return
		}
	}

	if err != http.ErrMissingFile {
		fileLocation = filepath.Join("asset/photos", header.Filename)
		os.Mkdir("asset/photos", os.ModePerm)
		ctx.SaveUploadedFile(header, fileLocation)
	}

	dataString := ctx.Request.FormValue("json")
	var dataJson model.Product

	if err = json.Unmarshal([]byte(dataString), &dataJson); err != nil {
		fmt.Println(err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed unmarshal object json" + err.Error()})
		return
	}

	dataJson.Photos = fileLocation

	err = cc.us.AddProduk(dataJson)

	if err != nil {
		fmt.Println(err.Error())
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"Message": "Success update data doctor",
	})
}

func (cc *productController) findById(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.JSON(http.StatusForbidden, gin.H{"message": "product not found"})
		return
	}

	idInt, err := strconv.Atoi(id)

	if err != nil {
		fmt.Println(err.Error())
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "invalid product ID"})
	}

	rest, err := cc.us.FindById(idInt)
	if err != nil {
		fmt.Println(err.Error())
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "OK", "data": rest})

}

func (cc *productController) listProduct(ctx *gin.Context) {
	rest, err := cc.us.ListProduct()
	if err != nil {
		fmt.Println(err.Error())
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "OK", "data": rest})

}

func (cc *productController) deleteProduct(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.JSON(http.StatusForbidden, gin.H{"message": "product not found"})
		return
	}

	idInt, _ := strconv.Atoi(id)
	err := cc.us.DeleteProduct(idInt)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "product deleted"})

}

func (cc *productController) updateProduct(ctx *gin.Context) {
	_, header, err := ctx.Request.FormFile("photos")
	var fileLocation string

	if err != nil {
		if err != http.ErrMissingFile {
			fmt.Println(err.Error())
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "failed get data from form"})
			return
		}
	}

	if err != http.ErrMissingFile {
		fileLocation = filepath.Join("asset/photos", header.Filename)
		os.Mkdir("asset/photos", os.ModePerm)
		ctx.SaveUploadedFile(header, fileLocation)
	}

	dataString := ctx.Request.FormValue("json")
	var dataJson model.Product

	if err = json.Unmarshal([]byte(dataString), &dataJson); err != nil {
		fmt.Println(err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed unmarshal object json" + err.Error()})
		return
	}

	dataJson.Photos = fileLocation

	if err := cc.us.UpdateProduct(dataJson); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": " success update product"})

}

func (cc *productController) findByIdUser(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.JSON(http.StatusForbidden, gin.H{"message": "product not found"})
		return
	}

	idInt, err := strconv.Atoi(id)

	if err != nil {
		fmt.Println(err.Error())
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "invalid product ID"})
	}

	rest, err := cc.us.FindByIdUser(idInt)
	if err != nil {
		fmt.Println(err.Error())
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "OK", "data": rest})
}

func (cc *productController) ProductRouter() {
	r := cc.rg.Group("product")
	r.GET("/:id", cc.findById)
	r.GET("user-product/:id", cc.findByIdUser)
	r.GET("/list", cc.listProduct)
	r.POST("/add", cc.addProduct)
	r.POST("/delete/:id", cc.deleteProduct)
	r.PUT("/update", cc.updateProduct)

}

func NewProductController(am middleware.AuthMiddleware, us usecase.ProductUsecase, rg *gin.RouterGroup) *productController {
	return &productController{
		am: am,
		us: us,
		rg: rg,
	}
}
