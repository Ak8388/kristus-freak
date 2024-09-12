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

	// Ambil file gambar dari form
	_, header, err := ctx.Request.FormFile("image_url")
	var fileLocation string

	if err != nil && err != http.ErrMissingFile {
		fmt.Println("Error getting file:", err.Error())
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "failed to get image file"})
		return
	}

	// Jika file diunggah, simpan file tersebut
	if err == nil {
		fileLocation = filepath.Join("asset/photos", header.Filename)
		// Buat direktori jika belum ada
		if err := os.MkdirAll("asset/photos", os.ModePerm); err != nil {
			fmt.Println("Error creating directory:", err.Error())
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create directory"})
			return
		}
		// Simpan file gambar
		if err := ctx.SaveUploadedFile(header, fileLocation); err != nil {
			fmt.Println("Error saving file:", err.Error())
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save image file"})
			return
		}
	}

	// Ambil data JSON dari form
	dataString := ctx.Request.FormValue("json")
	var blogData model.Blog

	// Parsing JSON ke dalam struct Blog
	if err := json.Unmarshal([]byte(dataString), &blogData); err != nil {
		fmt.Println("Error unmarshalling JSON:", err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to unmarshal JSON: " + err.Error()})
		return
	}

	// Set lokasi gambar ke Blog jika file diunggah
	if fileLocation != "" {
		blogData.Cover = fileLocation
	}
	fmt.Println(blogData)

	// Validasi data (misalnya title dan content tidak boleh kosong)
	if blogData.Title == "" || blogData.Content == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "title and content cannot be empty"})
		return
	}

	// Gunakan BlogUseCase untuk menyimpan blog ke database
	if err := bg.us.Add(blogData); err != nil {
		fmt.Println("Error saving blog to database:", err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save blog to database"})
		return
	}

	// Respon sukses
	ctx.JSON(http.StatusCreated, gin.H{
		"Message": "Success add blog",
		"Blog":    blogData,
	})
}

func (bg *blogController) findById(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.JSON(http.StatusForbidden, gin.H{"message": "article not found"})
		return
	}

	idInt, err := strconv.Atoi(id)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "invaid Id"})

	}

	rest, err := bg.us.FindById(idInt)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})

	}
	ctx.JSON(http.StatusOK, gin.H{"message": "OK", "data": rest})
}

func (bg *blogController) list(ctx *gin.Context) {
	rest, err := bg.us.List()
	if err != nil {
		fmt.Println(err.Error())
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "OK", "data": rest})

}

func (bg *blogController) delete(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.JSON(http.StatusForbidden, gin.H{"message": "article not found"})
		return
	}

	idInt, _ := strconv.Atoi(id)
	err := bg.us.Delete(idInt)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "article deleted"})
}

func (bg *blogController) update(ctx *gin.Context) {
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

	fmt.Println(dataJson)
	fmt.Println(fileLocation)

	dataJson.Cover = fileLocation

	if err := bg.us.Update(dataJson); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "success update article"})
}

func (bg *blogController) BlogRouter() {
	r := bg.rg.Group("blog")
	r.GET("/:id", bg.findById)
	r.GET("/list", bg.list)
	r.POST("/add", bg.add)
	r.POST("/delete/:id", bg.delete)
	r.PUT("/update", bg.update)
}

func NewBlogController(am middleware.AuthMiddleware, us usecase.BlogUseCase, rg *gin.RouterGroup) *blogController {
	return &blogController{
		am: am,
		us: us,
		rg: rg,
	}
}
