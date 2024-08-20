package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/driver/middleware"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/usecase"
)

type deliveryController struct {
	am              middleware.AuthMiddleware
	rg              *gin.RouterGroup
	deliveryUsecase usecase.DeliveryUsecase
}

func (d *deliveryController) getProvince(c *gin.Context) {
	res, err := d.deliveryUsecase.GetProvince()

	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ok", "data": res})
}

func (d *deliveryController) getCity(c *gin.Context) {
	key := c.Param("key")
	res, err := d.deliveryUsecase.GetCity(key)

	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ok", "data": res})
}

func (d *deliveryController) getCost(c *gin.Context) {
	var reqData model.CostRequest

	if err := c.ShouldBindJSON(&reqData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	res, err := d.deliveryUsecase.GetCost(reqData)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ok", "data": res})
}

func (d *deliveryController) DeliveryRouter() {
	r := d.rg.Group("delivery")

	r.GET("province", d.am.JwtVerified("CUSTOMER"), d.getProvince)
	r.GET("city/:key", d.am.JwtVerified("CUSTOMER"), d.getCity)
	r.POST("cost-delivery", d.am.JwtVerified("CUSTOMER"), d.getCost)
}

func NewDeliveryController(am middleware.AuthMiddleware, rg *gin.RouterGroup, deliveryUsecase usecase.DeliveryUsecase) *deliveryController {
	return &deliveryController{am, rg, deliveryUsecase}
}
