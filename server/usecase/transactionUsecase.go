package usecase

import (
	"errors"

	"github.com/google/uuid"
	"github.com/kriserohalia/company_profile/model"
	"github.com/kriserohalia/company_profile/repository"
)

type TransactionUsecase interface {
	CreatePayment(model.Transaction) (model.ResponseCreatePayment, error)
	TrackingTransaction(model.TrackingPaymentStatus) error
}

type transactionUsecase struct {
	rp repository.TransactionRepo
}

// CreatePayment implements TransactionUsecase.
func (tu *transactionUsecase) CreatePayment(mo model.Transaction) (resp model.ResponseCreatePayment,err error) {

	uid, err2 := uuid.NewRandom()
	if err2 != nil {
		return model.ResponseCreatePayment{} ,err
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
	
	if resp.TransactionTime == ""  || resp.TransactionStatus == "" || resp.SignatureKey == "" {
		return errors.New("invalid field")

	}

	return tu.rp.TrackingTransaction(resp)

	

}

func NewTransactionUsecase(rp repository.TransactionRepo) TransactionUsecase {
	return &transactionUsecase{
		rp: rp,
	}
}
