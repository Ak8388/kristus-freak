package controller

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/driver/middleware"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/usecase"
)

type userController struct {
	am middleware.AuthMiddleware
	uc usecase.UserUsecase
	rg *gin.RouterGroup
}


func (us *userController) list(ctx *gin.Context){
	rest, err := us.uc.List()
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" :err.Error()})
	}
	ctx.JSON(http.StatusOK,gin.H{"message":"OK", "data" :rest})

}

func (us *userController) findById(ctx *gin.Context){

	id:=ctx.Param("id")
	fmt.Println("CEKKKK " + id)
	if id == ""{
		ctx.JSON(http.StatusForbidden, gin.H{"message":"user not found"})
		return 
	}

	idInt, err:= strconv.Atoi(id)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" :"invalid user ID"})
	}

	rest, err := us.uc.FindById(idInt)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" :err.Error()})
	}
	ctx.JSON(http.StatusOK,gin.H{"message":"OK", "data" :rest})

	
}
func (us *userController) deleteUser(ctx *gin.Context){

	id:=ctx.Param("id")
	if id == ""{
		ctx.JSON(http.StatusForbidden, gin.H{"message":"user not found"})
		return 
	}

	idInt, _ := strconv.Atoi(id)
	err := us.uc.DeleteUser(idInt)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message":err.Error()})
	}

	ctx.JSON(http.StatusOK, gin.H{"message":"User Deleted"})

}
func (us *userController) updateProfile(ctx *gin.Context){
	var UpdateProfileReq struct{
		Name string `json:"name"`
		Email string `json:"email"`
	}


	if err := ctx.ShouldBindJSON(&UpdateProfileReq);err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message":err.Error()})
	}

	id:=ctx.Param("id")
	if id == ""{
		ctx.JSON(http.StatusForbidden, gin.H{"message":"user not found"})
		return 
	}

	idInt, _ := strconv.Atoi(id)
	

	 if err:= us.uc.UpdateProfile(UpdateProfileReq.Name,UpdateProfileReq.Email,idInt);err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message" : err.Error()})
		return
	 }

	 ctx.JSON(http.StatusOK, gin.H{"message" : " Success update profile"})

}

func (us *userController) UserRouter(){
	r:= us.rg.Group("user")
	r.GET("/list-user",us.am.JwtVerified("OWNER"),us.list)
	r.GET("/:id",us.findById)
	r.POST("/delete-user/:id",us.deleteUser)
	r.PUT("/update-profile/:id",us.updateProfile)

}

func NewUserController(am middleware.AuthMiddleware,uc usecase.UserUsecase, rg *gin.RouterGroup) *userController{
	return &userController{am,uc,rg}

}

