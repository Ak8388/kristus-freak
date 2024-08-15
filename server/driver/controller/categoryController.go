package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kriserohalia/company_profile/driver/middleware"
	"github.com/kriserohalia/company_profile/model"
	"github.com/kriserohalia/company_profile/usecase"
)

type categoryController struct {
	am middleware.AuthMiddleware
	us usecase.CategoryUseCase
	rg *gin.RouterGroup
}

func (cc *categoryController) addCategory(ctx *gin.Context){
	var resp model.Category

	 if err := ctx.ShouldBindJSON(&resp);err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" :err.Error()})
		return
	 }

	 err := cc.us.AddCategory(resp)
	 if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" :err.Error()})
		return
	 }

	 ctx.JSON(http.StatusOK, gin.H{"message" :"Success Add Category"})

}

func (cc * categoryController) findById(ctx *gin.Context){
	id:=ctx.Param("id")
	if id == ""{
		ctx.JSON(http.StatusForbidden, gin.H{"message":"category not found"})
		return 
	}

	idInt, err:= strconv.Atoi(id)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" :"invalid category ID"})
	}

	rest, err := cc.us.FindById(idInt)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" :err.Error()})
	}
	ctx.JSON(http.StatusOK,gin.H{"message":"OK", "data" :rest})

}

func (cc * categoryController) listCategory(ctx *gin.Context){
	rest, err := cc.us.ListCategory()
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" :err.Error()})
	}
	ctx.JSON(http.StatusOK,gin.H{"message":"OK", "data" :rest})

}

func (cc * categoryController) deleteCategory(ctx *gin.Context){
	id:=ctx.Param("id")
	if id == ""{
		ctx.JSON(http.StatusForbidden, gin.H{"message":"category not found"})
		return 
	}

	idInt, _ := strconv.Atoi(id)
	err := cc.us.DeleteCategory(idInt)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message":err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message":"category Deleted"})

}

func (cc * categoryController) updateCategory(ctx *gin.Context){
	var updatecategoryReq struct{
		Name string `json:"name"`
	}


	if err := ctx.ShouldBindJSON(&updatecategoryReq);err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message":err.Error()})
		return
	}

	id:=ctx.Param("id")
	if id == ""{
		ctx.JSON(http.StatusForbidden, gin.H{"message":"category not found"})
		return 
	}

	idInt, _ := strconv.Atoi(id)
	
	 if err:= cc.us.UpdateCategory(updatecategoryReq.Name,idInt);err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" : err.Error()})
		return
	 }

	 ctx.JSON(http.StatusOK, gin.H{"message" : " Success update category"})


}

func (cc *categoryController) CategoryRouter(){
	r:= cc.rg.Group("category")
	r.GET("/list",cc.listCategory)
	r.GET("/:id",cc.findById)
	r.POST("/add",cc.addCategory)
	r.POST("/delete/:id",cc.deleteCategory)
	r.PUT("/update/:id",cc.updateCategory)
	
	// r:= cc.rg.Group("category")
	// r.GET("/list",cc.am.JwtVerified("OWNER"),cc.listCategory)
	// r.GET("/:id",cc.am.JwtVerified("OWNER"),cc.findById)
	// r.POST("/add",cc.am.JwtVerified("OWNER"),cc.addCategory)
	// r.POST("/delete/:id",cc.am.JwtVerified("OWNER"),cc.deleteCategory)
	// r.PUT("/update/:id",cc.am.JwtVerified("OWNER"),cc.updateCategory)
}


func NewCategoryController(am middleware.AuthMiddleware, us usecase.CategoryUseCase, rg *gin.RouterGroup) *categoryController{
	return &categoryController{
		am: am,
		us: us,
		rg: rg,
	}

}
