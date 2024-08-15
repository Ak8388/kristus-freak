package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kriserohalia/company_profile/driver/middleware"
	"github.com/kriserohalia/company_profile/model"
	"github.com/kriserohalia/company_profile/usecase"
)

type customController struct {
	am middleware.AuthMiddleware
	us usecase.CustomUsecase
	rg *gin.RouterGroup
}

func (cc *customController) add(ctx *gin.Context){
	var resp model.Custom

	 if err := ctx.ShouldBindJSON(&resp);err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" :err.Error()})
		return
	 }

	 err := cc.us.AddCustom(resp)
	 if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" :err.Error()})
		return
	 }

	 ctx.JSON(http.StatusOK, gin.H{"message" :"success add detail"})

}

func (cc *customController) findById(ctx *gin.Context){
	id:=ctx.Param("id")
	if id == ""{
		ctx.JSON(http.StatusForbidden, gin.H{"message":"product not found"})
		return 
	}

	idInt, err:= strconv.Atoi(id)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" :"invalid product ID"})
	}

	rest, err := cc.us.FindByIdCustom(idInt)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" :err.Error()})
	}
	ctx.JSON(http.StatusOK,gin.H{"message":"OK", "data" :rest})

}

func (cc *customController) listCustom(ctx *gin.Context){
	rest, err := cc.us.ListCustom()
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" :err.Error()})
	}
	ctx.JSON(http.StatusOK,gin.H{"message":"OK", "data" :rest})

}

func (cc *customController) deleteCustom(ctx *gin.Context){
	id:=ctx.Param("id")
	if id == ""{
		ctx.JSON(http.StatusForbidden, gin.H{"message":"product not found"})
		return 
	}

	idInt, _ := strconv.Atoi(id)
	err := cc.us.DeleteCustom(idInt)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message":err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message":"product deleted"})

}

func (cc *customController) updateCustom(ctx *gin.Context){
	var updateCustomReq struct{
		CategoryName        int       `json:"category_name"`
		Material            string    `json:"material"`
		Size                string    `json:"size"`
		Photos              string    `json:"photos"`
		Qty                 int       `json:"qty"`
		Notes               string    `json:"note"`
		IdStatus            int       `json:"id_status"`
		EstimateWorkmanship int       `json:"estimate_workmanship"`
		AddressShipping     string    `json:"address_shipping"`
	}


	if err := ctx.ShouldBindJSON(&updateCustomReq);err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message":err.Error()})
		return
	}

	id:=ctx.Param("id")
	if id == ""{
		ctx.JSON(http.StatusForbidden, gin.H{"message":"custom order not found"})
		return 
	}

	idInt, _ := strconv.Atoi(id)
	
	 if err:= cc.us.UpdateCustom(idInt,updateCustomReq.CategoryName,updateCustomReq.Qty, updateCustomReq.IdStatus, updateCustomReq.EstimateWorkmanship, updateCustomReq.Material, updateCustomReq.Size, updateCustomReq.Photos, updateCustomReq.Notes, updateCustomReq.AddressShipping); err != nil {	
	 ctx.JSON(http.StatusBadRequest, gin.H{"message" : err.Error()})
		return
	 }

	 ctx.JSON(http.StatusOK, gin.H{"message" : " success update custom"})


}


func (cc *customController) CustomRouter() {
	r:= cc.rg.Group("custom-order")
	r.GET("/:id",cc.findById)
	r.GET("/list",cc.listCustom)
	r.POST("/add",cc.add)
	r.POST("/delete/:id",cc.deleteCustom)
	r.PUT("/update/:id",cc.updateCustom)
	
	// r:= cc.rg.Group("custom-order")
	// r.GET("/:id",cc.am.JwtVerified("OWNER","CUSTOMER"),cc.findById)
	// r.GET("/list",cc.am.JwtVerified("OWNER","CUSTOMER"),cc.listCustom)
	// r.POST("/add",cc.am.JwtVerified("OWNER","CUSTOMER"),cc.add)
	// r.POST("/delete/:id",cc.am.JwtVerified("OWNER"),cc.deleteCustom)
	// r.PUT("/update/:id",cc.am.JwtVerified("OWNER","CUSTOMER"),cc.updateCustom)
	
}

func NewCustomController (am middleware.AuthMiddleware, us usecase.CustomUsecase, rg *gin.RouterGroup) *customController{
	return &customController {
		am:am,
		us:us,
		rg:rg,
	}
}