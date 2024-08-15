package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/driver/middleware"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/usecase"
)

type companyController struct {
	am middleware.AuthMiddleware
	us usecase.CompanyUsecase
	rg *gin.RouterGroup
}


func (cc *companyController) findById(ctx *gin.Context){

	id := ctx.Param("id")
	if (id == ""){
		ctx.JSON(http.StatusForbidden, gin.H{"message":"profile not found"})
		return 
	}

	idInt, err:= strconv.Atoi(id)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" : "invalid profile id"})

	}

	rest, err := cc.us.FindById(idInt)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})

	}

	ctx.JSON(http.StatusOK, gin.H{"message" :"OK", "data":rest})
}


func (cc *companyController) listCompany(ctx *gin.Context){
	rest, err := cc.us.ListCompany()
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" :err.Error()})
	}
	ctx.JSON(http.StatusOK,gin.H{"message":"OK", "data" :rest})

}

func (cc *companyController) updateCompany(ctx *gin.Context){

	var updateprofileReq struct {
		Name        string     `json:"name"`
		Description string     `json:"description"`
		Address     string     `json:"address"`
		Email       string     `json:"email"`
		Phone       string     `json:"phone"`
		Logo        string     `json:"logo_url"`
		Vision      string     `json:"vision"`
		Mision      string     `json:"mision"`

	}


	if err := ctx.ShouldBindJSON(&updateprofileReq);err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message":err.Error()})
		return
	}

	id:=ctx.Param("id")
	if id == ""{
		ctx.JSON(http.StatusForbidden, gin.H{"message":"category not found"})
		return 
	}

	idInt, _ := strconv.Atoi(id)

	if err:= cc.us.UpdateCompany(updateprofileReq.Name,updateprofileReq.Description,updateprofileReq.Address,updateprofileReq.Email,updateprofileReq.Phone,updateprofileReq.Logo,updateprofileReq.Vision,updateprofileReq.Mision,idInt);err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" : err.Error()})
		return
	 }

	 ctx.JSON(http.StatusOK, gin.H{"message" : " Success update category"})

}



func (cc *companyController) CompanyRouter(){
	r:= cc.rg.Group("company")
	r.GET("/",cc.listCompany)
	r.GET("/:id",cc.findById)
	// r.POST("/add",cc.addCompany)
	// r.POST("/delete/:id",cc.deleteCompany)
	r.PUT("/update/:id",cc.updateCompany)
}


func NewCompanyController (am middleware.AuthMiddleware, us usecase.CompanyUsecase ,rg *gin.RouterGroup) *companyController {
	return &companyController{
		am: am,
		us: us,
		rg: rg,
	}

}
