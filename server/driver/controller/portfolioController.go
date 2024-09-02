package controller

import (
	"net/http"
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

func (pc *portfolioController) add(ctx * gin.Context){
	var resp model.Portfolio

	if err := ctx.ShouldBindBodyWithJSON(&resp); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	err := pc.us.Add(resp)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return 
	}

	ctx.JSON(http.StatusOK, gin.H{"message" : "succes add portfolio"})
}

func (pc *portfolioController) findById(ctx *gin.Context){
	id := ctx.Param("id")
	if id == ""{
		ctx.JSON(http.StatusForbidden, gin.H{"message" : "portfolio not found"})
		return
	}

	idInt, err := strconv.Atoi(id)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message":"invalid portfolio Id"})

	}
	
	rest, err := pc.us.FindById(idInt)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" : err.Error()})
	}
	ctx.JSON(http.StatusOK, gin.H{"message":"OK", "data":rest})
}

func (pc *portfolioController) list(ctx *gin.Context){
	rest, err := pc.us.List()
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message":err.Error()})
	}
	ctx.JSON(http.StatusOK, gin.H{"message":"OK", "data":rest})
}

func (pc *portfolioController) delete(ctx *gin.Context){
	id := ctx.Param("id")
	if id == ""{
		ctx.JSON(http.StatusForbidden, gin.H{"message":"portfolio not found"})
		return
	}

	idInt, _ := strconv.Atoi(id)
	err := pc.us.Delete(idInt)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message":err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message":"portfolio id deleted"})
}


func (pc *portfolioController) update(ctx *gin.Context){
	var updatePortfolioReq struct {
		Name string `json:"name"`
		Description string `json:"description"`
		Image string `json:"image"`
		Date string `json:"date"`
	}

	if err := ctx.ShouldBindJSON(&updatePortfolioReq);err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message":err.Error()})
		return
	}

	id := ctx.Param("id")
	if id == "" {
		ctx.JSON(http.StatusForbidden, gin.H{"message":"data not found"})
		return 
	}

	idInt, _ := strconv.Atoi(id)

	if err := pc.us.Update(idInt,updatePortfolioReq.Name, updatePortfolioReq.Description, updatePortfolioReq.Image, updatePortfolioReq.Date); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" : err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message":"success update service"})
}

func (pc *portfolioController) PortfolioRouter(){
	r:= pc.rg.Group("portfolio")
	r.GET("/:id", pc.findById)
	r.GET("/list", pc.list)
	r.POST("/add",pc.add)
	r.POST("/delete/:id",pc.delete)
	r.PUT("/update/:id",pc.update)
}

func NewPortfolioController (am middleware.AuthMiddleware, us usecase.PortfolioUsecase, rg *gin.RouterGroup) *portfolioController{
	return &portfolioController{
		am: am,
		us: us,
		rg: rg,
	}
}