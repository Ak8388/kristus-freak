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

type blogController struct {
	am middleware.AuthMiddleware
	us usecase.BlogUseCase
	rg *gin.RouterGroup
}

func (bg *blogController) add(ctx *gin.Context) {
	_, header, err := ctx.Request.FormFile("image_url")
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
	var dataJson model.Blog

	if err = json.Unmarshal([]byte(dataString), &dataJson); err != nil {
		fmt.Println(err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed unmarshal object json" + err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"Message": "Success update article",
	})
}

func (bg *blogController) findById(ctx *gin.Context){
	id := ctx.Param("id")
	if id == ""{
		ctx.JSON(http.StatusForbidden, gin.H{"message" :"article not found"})
		return
	}

	idInt, err := strconv.Atoi(id)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" :"invaid Id"})

	}

	rest, err := bg.us.FindById(idInt)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})

	}
	ctx.JSON(http.StatusOK, gin.H{"message" : "OK", "data": rest})
}


func (bg *blogController) list(ctx *gin.Context) {
	rest, err := bg.us.List()
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})

	}

	ctx.JSON(http.StatusOK, gin.H{"message":"OK", "data":rest})

}

func (bg *blogController) delete(ctx *gin.Context) {
	id := ctx.Param ("id")
	if id == ""{
		ctx.JSON(http.StatusForbidden, gin.H{"message":"article not found"})
		return 
	}

	idInt, _ := strconv.Atoi(id)
	err := bg.us.Delete(idInt)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return 
	}

	ctx.JSON(http.StatusOK, gin.H{"message" :"article deleted"})
}

func (bg *blogController) update(ctx *gin.Context){
	_, header, err := ctx.Request.FormFile("photos")
	var fileLocation string

	if err != nil {
		if err != http.ErrMissingFile {
			fmt.Println(err.Error())
			ctx.JSON(http.StatusBadRequest, gin.H{"error":"failed get data from form"})
			return
		}
	}

	if err != http.ErrMissingFile {
		fileLocation = filepath.Join("asset/photos", header.Filename)
		os.Mkdir("asset/photos", os.ModePerm)
		ctx.SaveUploadedFile(header, fileLocation)
	}

	dataString := ctx.Request.FormValue("json")
	var dataJson model.Blog

	if err = json.Unmarshal([]byte(dataString), &dataJson); err != nil {
		fmt.Println(err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error":"failed unmarshal object json" + err.Error()})
		return
	}

	dataJson.Cover = fileLocation

	if err := bg.us.Update(dataJson); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message":"success update article"})
}

func (bg *blogController) BlogRouter(){
	r := bg.rg.Group("blog")
	r.GET("/:id", bg.findById)
	r.GET("/list", bg.list)
	r.POST("/add",bg.add)
	r.POST("/delete/:id",bg.delete)
	r.PUT("/update",bg.update)
}

func NewBlogController (am middleware.AuthMiddleware, us usecase.BlogUseCase, rg *gin.RouterGroup) *blogController {
	return &blogController {
		am :am,
		us:us,
		rg:rg,
	}
}