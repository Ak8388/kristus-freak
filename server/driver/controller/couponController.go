package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/driver/middleware"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/usecase"
)

type couponController struct {
	rg            *gin.RouterGroup
	am            middleware.AuthMiddleware
	usecaseCoupon usecase.CouponUsecase
}

func (coupon *couponController) couponAdd(ctx *gin.Context) {
	var coupenReq model.CouponModel
	var idNum int

	id := ctx.Query("userId")

	if id == "" {
		ida, exist := ctx.Get("Id")
		if exist {
			idNum = int(ida.(float64))
		} else {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "id user null"})
			return
		}
	} else {
		idNum, _ = strconv.Atoi(id)
	}

	coupenReq.IdUser = idNum

	if err := ctx.ShouldBind(&coupenReq); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := coupon.usecaseCoupon.CouponAdd(coupenReq)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "ok"})
}

func (coupon *couponController) couponGet(ctx *gin.Context) {
	id := ctx.Query("userId")
	var idNum int

	if id == "" {
		ida, exist := ctx.Get("Id")
		if exist {
			idNum = int(ida.(float64))
		} else {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "id user null"})
			return
		}
	} else {
		idNum, _ = strconv.Atoi(id)
	}

	couponReq := model.CouponModel{
		ID:       id,
		IdUser:   idNum,
		Code:     "",
		Discount: "",
	}

	res, err := coupon.usecaseCoupon.CouponGet(couponReq)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "ok", "data": res})
}

func (coupon *couponController) couponUpdate(ctx *gin.Context) {
	var coupenReq model.CouponModel

	if err := ctx.ShouldBind(&coupenReq); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := coupon.usecaseCoupon.CouponUpdate(coupenReq)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "ok"})
}

func (coupon *couponController) couponDelete(ctx *gin.Context) {
	var coupenReq struct {
		ID string `json:"id"`
	}

	if err := ctx.ShouldBind(&coupenReq); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := coupon.usecaseCoupon.CouponDelete(coupenReq.ID)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "ok"})
}

func (coupon *couponController) CoupenRouter() {
	r := coupon.rg.Group("coupon")

	r.POST("", coupon.am.JwtVerified("OWNER", "CUSTOMER"), coupon.couponAdd)
	r.GET("", coupon.am.JwtVerified("OWNER", "CUSTOMER"), coupon.couponGet)
	r.PUT("", coupon.am.JwtVerified("OWNER", "CUSTOMER"), coupon.couponUpdate)
	r.DELETE("", coupon.am.JwtVerified("OWNER", "CUSTOMER"), coupon.couponDelete)
}

func NewCoupenRouter(rg *gin.RouterGroup, am middleware.AuthMiddleware, usecaseCoupon usecase.CouponUsecase) *couponController {
	return &couponController{
		rg:            rg,
		am:            am,
		usecaseCoupon: usecaseCoupon,
	}
}
