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

type portfolioController struct {
	am middleware.AuthMiddleware
	us usecase.PortfolioUsecase
	rg *gin.RouterGroup
}

func (pc *portfolioController) add(ctx *gin.Context) {
	_, header, err := ctx.Request.FormFile("project_image")
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

	var dataJson model.Portfolio

	if err = json.Unmarshal([]byte(dataString), &dataJson); err != nil {
		fmt.Println(err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed unmarshal object json" + err.Error()})
		return
	}

	dataJson.ProjectImage = fileLocation

	err = pc.us.Add(dataJson)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "succes add portfolio"})
}

func (pc *portfolioController) findById(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.JSON(http.StatusForbidden, gin.H{"message": "portfolio not found"})
		return
	}

	idInt, err := strconv.Atoi(id)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "invalid portfolio Id"})

	}

	rest, err := pc.us.FindById(idInt)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "OK", "data": rest})
}

func (pc *portfolioController) list(ctx *gin.Context) {
	rest, err := pc.us.List()
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "OK", "data": rest})
}

func (pc *portfolioController) delete(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.JSON(http.StatusForbidden, gin.H{"message": "portfolio not found"})
		return
	}

	idInt, _ := strconv.Atoi(id)
	err := pc.us.Delete(idInt)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "portfolio id deleted"})
}

func (pc *portfolioController) update(ctx *gin.Context) {
	_, header, err := ctx.Request.FormFile("project_image")
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

	var dataJson model.Portfolio

	if err = json.Unmarshal([]byte(dataString), &dataJson); err != nil {
		fmt.Println(err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed unmarshal object json" + err.Error()})
		return
	}

	dataJson.ProjectImage = fileLocation

	id := ctx.Param("id")
	if id == "" {
		ctx.JSON(http.StatusForbidden, gin.H{"message": "data not found"})
		return
	}

	idInt, _ := strconv.Atoi(id)

	if err := pc.us.Update(idInt, dataJson.ProjectName, dataJson.ProjectDescription, dataJson.ProjectImage, dataJson.ProjectDate); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "success update service"})
}

func (pc *portfolioController) PortfolioRouter() {
	r := pc.rg.Group("portfolio")
	r.GET("/:id", pc.findById)
	r.GET("/list", pc.list)
	r.POST("/add", pc.add)
	r.DELETE("/delete/:id", pc.delete)
	r.PUT("/update/:id", pc.update)
}

func NewPortfolioController(am middleware.AuthMiddleware, us usecase.PortfolioUsecase, rg *gin.RouterGroup) *portfolioController {
	return &portfolioController{
		am: am,
		us: us,
		rg: rg,
	}
}
