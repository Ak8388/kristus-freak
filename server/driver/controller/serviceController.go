package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/driver/middleware"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/usecase"
)

type serviceController struct {
	am middleware.AuthMiddleware
	us usecase.ServiceUsecase
	rg *gin.RouterGroup
}

func (sc *serviceController) addService(ctx *gin.Context){
	var resp model.Service

	if err := ctx.ShouldBindJSON(&resp);err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" :err.Error()})
		return
	 }

	 err := sc.us.AddService(resp)
	 if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" :err.Error()})
		return
	 }

	ctx.JSON(http.StatusOK, gin.H{"message" :"success add service"})

}

func (sc *serviceController) findById(ctx *gin.Context){
	id := ctx.Param("id")
	if id == "" {
		ctx.JSON(http.StatusForbidden, gin.H{"message":"product not found"})
		return 
	}

	idInt, err:= strconv.Atoi(id)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" :"invalid product ID"})
	}

	rest, err := sc.us.FindById(idInt)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" :err.Error()})
	}
	ctx.JSON(http.StatusOK,gin.H{"message":"OK", "data" :rest})

}


func (sc *serviceController) listService(ctx *gin.Context){
	rest, err := sc.us.ListService()
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" :err.Error()})
	}
	ctx.JSON(http.StatusOK,gin.H{"message":"OK", "data" :rest})

}

func (sc *serviceController) deleteService(ctx *gin.Context){
	id := ctx.Param("id")
	if id == ""{
		ctx.JSON(http.StatusForbidden, gin.H{"message":"product not found"})
		return 

	}

	idInt, _ := strconv.Atoi(id)
	err := sc.us.DeleteService(idInt)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message":err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message":"product deleted"})

}


func (sc *serviceController) updateService(ctx *gin.Context){
	var updateServiceReq struct {
		Name string `json:"name"`
		Description string `json:"description"`
	}

	if err := ctx.ShouldBindJSON(&updateServiceReq);err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message":err.Error()})
		return
	}

	id:=ctx.Param("id")
	if id == ""{
		ctx.JSON(http.StatusForbidden, gin.H{"message":"Product not found"})
		return 
	}

	idInt, _ := strconv.Atoi(id)
	
	 if err:= sc.us.UpdateService(updateServiceReq.Name,updateServiceReq.Description,idInt);err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" : err.Error()})
		return
	 }

	 ctx.JSON(http.StatusOK, gin.H{"message" : " success update service"})

}

func (sc *serviceController) ServiceRouter(){
	r:= sc.rg.Group("service")
	r.GET("/:id", sc.findById)
	r.GET("/list",sc.listService)
	r.POST("/add",sc.addService)
	r.POST("/delete/:id",sc.deleteService)
	r.PUT("/update/:id",sc.updateService)
}

func NewServiceController ( am middleware.AuthMiddleware,us usecase.ServiceUsecase,rg *gin.RouterGroup ) *serviceController {
	return &serviceController{
		am: am,
		us: us,
		rg: rg,
	}
}