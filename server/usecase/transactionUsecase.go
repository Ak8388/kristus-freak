package usecase

import (
	"errors"

	"github.com/google/uuid"

	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model/dto"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/repository"
)

type TransactionUsecase interface {
	CreatePayment(model.Transaction) (model.ResponseCreatePayment, error)
	TrackingTransaction(model.TrackingPaymentStatus) error
	ValidateTransaction(userId float64) bool
	ViewTransactionUser(userID float64, status string) ([]dto.TransDTO, error)
	ViewTransactionOwner(status string) ([]dto.TransDTO, error)
	CancelPaymentUser(orderId string) error
	UpdateStatus(orderId string, newStatusID int) error
	DeleteTransaction(orderId string) error
}

type transactionUsecase struct {
	rp repository.TransactionRepo
}

// CreatePayment implements TransactionUsecase.
func (tu *transactionUsecase) CreatePayment(mo model.Transaction) (resp model.ResponseCreatePayment, err error) {

	uid, err2 := uuid.NewRandom()
	if err2 != nil {
		return model.ResponseCreatePayment{}, err
	}

	mo.DetailTransaction.OrderID = uid.String()

	resp, err = tu.rp.CreatePayment(mo)

	if resp.Token == "" {
		return model.ResponseCreatePayment{}, err
	}
	if resp.RedirectURL == "" {
		return model.ResponseCreatePayment{}, err
	}
	if err != nil {
		return model.ResponseCreatePayment{}, err
	}
	return
}

// TrackingTransaction implements TransactionUsecase.
func (tu *transactionUsecase) TrackingTransaction(resp model.TrackingPaymentStatus) error {

	if resp.TransactionTime == "" || resp.TransactionStatus == "" || resp.SignatureKey == "" {
		return errors.New("invalid field")

	}

	return tu.rp.TrackingTransaction(resp)
}

func (tu *transactionUsecase) ValidateTransaction(userId float64) bool {
	return tu.rp.ValidateTransaction(userId)
}

func (tu *transactionUsecase) ViewTransactionUser(userID float64, status string) ([]dto.TransDTO, error) {
	return tu.rp.ViewTransactionUser(userID, status)
}

func (tu *transactionUsecase) ViewTransactionOwner(status string) ([]dto.TransDTO, error) {
	return tu.rp.ViewTransactionOwner(status)
}

func (tu *transactionUsecase) CancelPaymentUser(orderId string) error {
	return tu.rp.CancelPaymentUser(orderId)
}

func (tu *transactionUsecase) UpdateStatus(orderId string, newStatusID int) error {
	return tu.rp.UpdateStatus(orderId, newStatusID)
}

func (tu *transactionUsecase) DeleteTransaction(orderId string) error {
	return tu.rp.DeleteTransaction(orderId)
}

func NewTransactionUsecase(rp repository.TransactionRepo) TransactionUsecase {
	return &transactionUsecase{
		rp: rp,
	}
}
