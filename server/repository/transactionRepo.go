package repository

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
)

type TransactionRepo interface {
	CreatePayment(model.Transaction) (model.ResponseCreatePayment, error)
	TrackingTransaction(model.TrackingPaymentStatus) error
}

type transactionRepo struct {
	db *sql.DB
}

// CreatePayment implements TransactionRepo.
func (tr *transactionRepo) CreatePayment( resp model.Transaction) (model.ResponseCreatePayment, error) {
	client := &http.Client{}
	reqJson,errorEncode := json.Marshal(resp)
	respCreatePayment := model.ResponseCreatePayment{}

	if errorEncode != nil {
		return model.ResponseCreatePayment{}, errorEncode
	}
	newReq,err := http.NewRequest("POST",os.Getenv("URL_PAYMENT"),bytes.NewBuffer(reqJson))
	if err != nil {
		return model.ResponseCreatePayment{}, err
	}

	newReq.Header.Set("Content-Type","application/json")
	newReq.Header.Set("Accept","application/json")
	newReq.SetBasicAuth(os.Getenv("SERVER_KEY"),"")

	response,err := client.Do(newReq)
	if err != nil {
		return model.ResponseCreatePayment{}, err
	}

	defer response.Body.Close()

	body,_ := io.ReadAll(response.Body) 

	if response.StatusCode > 299 {
		return model.ResponseCreatePayment{}, errors.New(string(body))
	}

	err = json.Unmarshal(body,&respCreatePayment)


	query := "INSERT INTO tb_transaksi (product_id,id_user,amount,type_product,qty,addres_shipping,note,order_id,status_id ) values($1,$2,$3,$4,$5,$6,$7,$8,$9)"
	_,err = tr.db.Exec(query,resp.ItemDetails.Id, resp.CustomerDetail.Id, resp.DetailTransaction.GrossAmount, resp.ItemDetails.TypeProduct, resp.ItemDetails.Qty,resp.CustomerDetail.ShippingAddress,resp.ItemDetails.Note, resp.DetailTransaction.OrderID, 1)
	if err != nil {
		return  model.ResponseCreatePayment{}, err
	}
	return respCreatePayment, err
}

// TrackingTransaction implements TransactionRepo.
func (tr *transactionRepo) TrackingTransaction(resp model.TrackingPaymentStatus) error {
	if resp.TransactionStatus == "capture" || resp.TransactionStatus == "settlement" {
		query := "UPDATE tb_transaksi SET status_id=$1, updated_at=$2 WHERE order_id=$3 "
		_, err := tr.db.Exec(query,2, time.Now(),resp.OrderId)
		if err != nil {
			return err
		}
	} 

	return nil
}

func NewTransactionRepo(db *sql.DB) TransactionRepo {
	return &transactionRepo{db}
}
