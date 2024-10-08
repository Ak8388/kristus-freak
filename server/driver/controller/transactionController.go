package controller

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/driver/middleware"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/usecase"
)

type transactionController struct {
	am middleware.AuthMiddleware
	uc usecase.TransactionUsecase
	rg *gin.RouterGroup
}

func (tc *transactionController) createPayment(ctx *gin.Context) {
	var resp model.Transaction

	if err := ctx.ShouldBindJSON(&resp); err != nil {
		fmt.Println("This one Error:", err.Error())
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	if resp.CustomerDetail.Id == 0 {
		id, exi := ctx.Get("Id")

		if exi {
			resp.CustomerDetail.Id = int(id.(float64))
		}

	}

	res, err := tc.uc.CreatePayment(resp)
	if err != nil {
		fmt.Println("This secound Error:", err.Error())
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "success create payment", "data": res})
}

func (tc *transactionController) trackingTransaction(ctx *gin.Context) {
	var resp model.TrackingPaymentStatus

	if err := ctx.ShouldBindJSON(&resp); err != nil {
		fmt.Println(err.Error())
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	err := tc.uc.TrackingTransaction(resp)
	if err != nil {
		fmt.Println(err.Error())
		ctx.JSON(http.StatusOK, gin.H{"message": err.Error()})

		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "success tracking transaction"})
}

func (cc *transactionController) validateTransaction(c *gin.Context) {
	id, exist := c.Get("Id")

	if !exist {
		fmt.Println("failed get id user")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed get id user"})
		return
	}

	val := cc.uc.ValidateTransaction(id.(float64))

	if !val {
		fmt.Println("failed validate transaction")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "transaction not valid"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ok"})
}

func (cc *transactionController) viewTransactionUser(ctx *gin.Context) {
	status := ctx.Query("status")
	id, exist := ctx.Get("Id")

	if !exist {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed get id"})
		return
	}

	res, err := cc.uc.ViewTransactionUser(id.(float64), status)

	if err != nil {
		fmt.Println(err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "ok", "data": res})
}

func (cc *transactionController) viewTransactionOwner(ctx *gin.Context) {
	status := ctx.Query("status")

	res, err := cc.uc.ViewTransactionOwner(status)

	if err != nil {
		fmt.Println(err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "ok", "data": res})
}

func (cc *transactionController) cancelPaymentUser(ctx *gin.Context) {
	var Request struct {
		OrderID string `json:"orderId"`
	}

	if err := ctx.ShouldBindJSON(&Request); err != nil {
		fmt.Println(err.Error())
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := cc.uc.CancelPaymentUser(Request.OrderID)

	if err != nil {
		fmt.Println(err.Error())
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "ok"})
}

func (cc *transactionController) updateStatus(ctx *gin.Context) {
	var Request struct {
		OrderId     string `json:"orderId"`
		NewStatusID int    `json:"stId"`
	}

	if err := ctx.ShouldBindJSON(&Request); err != nil {
		fmt.Println(err.Error())
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := cc.uc.UpdateStatus(Request.OrderId, Request.NewStatusID)

	if err != nil {
		fmt.Println(err.Error())
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "ok"})
}

func (cc *transactionController) deleteTransaction(ctx *gin.Context) {
	var Request struct {
		OrderId string `json:"orderId"`
	}

	if err := ctx.ShouldBindJSON(&Request); err != nil {
		fmt.Println(err.Error())
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := cc.uc.DeleteTransaction(Request.OrderId)

	if err != nil {
		fmt.Println(err.Error())
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "ok"})
}

func (cc *transactionController) TransactionRouter() {
	r := cc.rg.Group("transaction")
	r.POST("/add", cc.am.JwtVerified("OWNER", "CUSTOMER"), cc.createPayment)
	r.POST("/tracking", cc.trackingTransaction)
	r.POST("/valid", cc.am.JwtVerified("CUSTOMER"), cc.validateTransaction)
	r.PUT("/cancel", cc.am.JwtVerified("CUSTOMER", "OWNER"), cc.cancelPaymentUser)
	r.GET("transaction-user", cc.am.JwtVerified("CUSTOMER"), cc.viewTransactionUser)
	r.GET("transaction-owner", cc.am.JwtVerified("OWNER"), cc.viewTransactionOwner)
	r.PUT("status", cc.am.JwtVerified("OWNER", "CUSTOMER"), cc.updateStatus)
	r.DELETE("", cc.am.JwtVerified("OWNER"), cc.deleteTransaction)
}

func NewTransactionController(am middleware.AuthMiddleware, uc usecase.TransactionUsecase, rg *gin.RouterGroup) *transactionController {
	return &transactionController{
		am: am,
		uc: uc,
		rg: rg,
	}
}
