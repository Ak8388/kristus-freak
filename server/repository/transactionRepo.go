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
func (tr *transactionRepo) CreatePayment(resp model.Transaction) (model.ResponseCreatePayment, error) {
	client := &http.Client{}
	reqJson, errorEncode := json.Marshal(resp)
	respCreatePayment := model.ResponseCreatePayment{}

	if errorEncode != nil {
		return model.ResponseCreatePayment{}, errorEncode
	}
	newReq, err := http.NewRequest("POST", os.Getenv("URL_PAYMENT"), bytes.NewBuffer(reqJson))
	if err != nil {
		return model.ResponseCreatePayment{}, err
	}

	newReq.Header.Set("Content-Type", "application/json")
	newReq.Header.Set("Accept", "application/json")
	newReq.SetBasicAuth(os.Getenv("SERVER_KEY"), "")

	response, err := client.Do(newReq)
	if err != nil {
		return model.ResponseCreatePayment{}, err
	}

	defer response.Body.Close()

	body, _ := io.ReadAll(response.Body)

	if response.StatusCode > 299 {
		return model.ResponseCreatePayment{}, errors.New(string(body))
	}

	err = json.Unmarshal(body, &respCreatePayment)

	query := "INSERT INTO tb_transaksi (product_id,id_user,amount,type_product,qty,addres_shipping,note,order_id,status_id ) values($1,$2,$3,$4,$5,$6,$7,$8,$9)"
	for _, data := range resp.ItemDetails {
		if data.Name != "shipping cost" {
			_, err = tr.db.Exec(query, data.Id, resp.CustomerDetail.Id, resp.DetailTransaction.GrossAmount, data.TypeProduct, data.Qty, resp.CustomerDetail.ShippingAddress, data.Note, resp.DetailTransaction.OrderID, 1)
			if err != nil {
				return model.ResponseCreatePayment{}, err
			}
		}
	}
	return respCreatePayment, err
}

// TrackingTransaction implements TransactionRepo.
func (tr *transactionRepo) TrackingTransaction(resp model.TrackingPaymentStatus) error {
	if resp.TransactionStatus == "capture" || resp.TransactionStatus == "settlement" {
		var prodId, qty, stock []int
		query := "UPDATE tb_transaksi SET status_id=$1, updated_at=$2 WHERE order_id=$3"
		qry2 := "Select product_id, qty From tb_transaksi Where order_id=$1"
		qryForStock := "Select stock from tb_produk_detail where id_produk=$1"
		qry3 := "Update tb_produk_detail Set stock=$1 - $2 Where id_produk=$3"
		tx, err := tr.db.Begin()

		if err != nil {
			return err
		}

		err = tx.QueryRow(query, 2, time.Now(), resp.OrderId).Scan(&prodId, &qty)

		if err != nil {
			tx.Rollback()
			return err
		}

		row, err := tx.Query(qry2, resp.OrderId)

		if err != nil {
			tx.Rollback()
			return err
		}

		for row.Next() {
			var prodId2, qty2 int

			err = row.Scan(&prodId2, &qty2)

			if err != nil {
				tx.Rollback()
				return err
			}

			prodId = append(prodId, prodId2)
			qty = append(qty, qty2)
		}

		row.Close()

		rows, err := tx.Query(qryForStock, prodId)

		if err != nil {
			tx.Rollback()
			return err
		}

		for rows.Next() {
			var stock2 int
			err = rows.Scan(&stock2)

			if err != nil {
				tx.Rollback()
				return err
			}

			stock = append(stock, stock2)
		}

		rows.Close()

		for index, id := range prodId {
			_, err := tx.Exec(qry3, stock[index], qty[index], id)

			if err != nil {
				tx.Rollback()
				return err
			}
		}
	}

	return nil
}

func NewTransactionRepo(db *sql.DB) TransactionRepo {
	return &transactionRepo{db}
}
