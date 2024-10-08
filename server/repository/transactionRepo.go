package repository

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model/dto"
)

type TransactionRepo interface {
	CreatePayment(model.Transaction) (model.ResponseCreatePayment, error)
	TrackingTransaction(model.TrackingPaymentStatus) error
	ValidateTransaction(userId float64) bool
	ViewTransactionUser(userID float64, status string) ([]dto.TransDTO, error)
	ViewTransactionOwner(status string) ([]dto.TransDTO, error)
	CancelPaymentUser(orderId string) error
	UpdateStatus(orderId string, newStatusID int) error
	DeleteTransaction(orderId string) error
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

	query := "INSERT INTO tb_transaksi (product_id, id_user, amount, type_product, qty, addres_shipping, note, order_id, status_id, post_code, phone_number, customer_name) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)"
	for _, data := range resp.ItemDetails {
		if data.Name != "shipping cost" {
			_, err = tr.db.Exec(query, data.Id, resp.CustomerDetail.Id, resp.DetailTransaction.GrossAmount, data.TypeProduct, data.Qty, resp.CustomerDetail.ShippingAddress, data.Note, resp.DetailTransaction.OrderID, 1, resp.CustomerDetail.PostCode, resp.CustomerDetail.PhoneNumber, resp.CustomerDetail.Name)
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
		var stock []int
		var DTOUpd []dto.DtoUpdate
		query := "UPDATE tb_transaksi SET status_id=$1, updated_at=$2 WHERE order_id=$3"
		qry2 := "Select id, product_id, qty, id_user, customer_name, phone_number, addres_shipping, post_code From tb_transaksi Where order_id=$1"
		qryForStock := "Select stock from tb_produk where id=$1"
		qry3 := "UPDATE tb_produk SET stock = CAST($1 AS INTEGER) - CAST($2 AS INTEGER) WHERE id = $3"
		qry4 := "Insert Into shipping (idUser, idTransaction, name, noTelp, address, postCode, status, expedition) Values($1,$2,$3,$4,$5,$6,$7,$8)"

		tx, err := tr.db.Begin()

		if err != nil {
			return err
		}

		_, err = tx.Exec(query, 2, time.Now(), resp.OrderId)

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
			dtoUpd := dto.DtoUpdate{}

			err = row.Scan(&dtoUpd.ID, &dtoUpd.ProdID, &dtoUpd.Qty, &dtoUpd.UserID, &dtoUpd.CusName, &dtoUpd.PhoneNumber, &dtoUpd.AddressShipp, &dtoUpd.PostCode)

			if err != nil {
				tx.Rollback()
				return err
			}

			DTOUpd = append(DTOUpd, dtoUpd)
		}

		row.Close()

		for _, id := range DTOUpd {
			var stock2 int
			err = tx.QueryRow(qryForStock, id.ProdID).Scan(&stock2)

			if err != nil {
				tx.Rollback()
				return err
			}

			stock = append(stock, stock2)
		}
		for index, id := range DTOUpd {
			fmt.Println("This stock and ID:", stock[index], DTOUpd[0].ProdID)
			fmt.Println("This stock and qty:", stock[index], DTOUpd[0].Qty)
			_, err := tx.Exec(qry3, stock[index], id.Qty, id.ProdID)

			if err != nil {
				tx.Rollback()
				return err
			}

			_, err = tx.Exec(qry4, id.UserID, id.ID, id.CusName, id.PhoneNumber, id.AddressShipp, id.PostCode, "1", "JNE")

			if err != nil {
				fmt.Println(err.Error())
				tx.Rollback()
				return err
			}
			tx.Commit()
		}
	}

	if resp.TransactionStatus == "expire" {
		query := "UPDATE tb_transaksi SET status_id=$1, updated_at=$2 WHERE order_id=$3"
		_, err := tr.db.Exec(query, 6, time.Now(), resp.OrderId)

		if err != nil {
			return err
		}
	}

	return nil
}

func (tr *transactionRepo) ValidateTransaction(userId float64) bool {
	qry := "Select id From tb_transaksi Where id_user=$1 AND status_id=$2"
	id := 0
	err := tr.db.QueryRow(qry, userId, 1).Scan(&id)

	if err != nil {
		return err == sql.ErrNoRows
	}

	if id > 0 {
		return false
	}

	return true
}

func (tr *transactionRepo) ViewTransactionUser(userID float64, status string) (data []dto.TransDTO, err error) {
	qry := "Select * from tb_transaksi Where id_user=$1 AND "
	var cA, uA, dA any
	var param []any
	param = append(param, userID)

	if status != "" {
		param = append(param, status)
		qry += "status_id=$2 "
	}

	qry += "deleted_at IS NULL ORDER BY created_at DESC"

	row, err := tr.db.Query(qry, param...)

	if err != nil {
		return nil, err
	}

	for row.Next() {
		modelTrans := dto.TransDTO{}

		err = row.Scan(&modelTrans.Id, &modelTrans.ItemDetails.Id, &modelTrans.CustomerDetail.Id, &modelTrans.DetailTrans.GrossAmount, &modelTrans.ItemDetails.TypeProduct, &modelTrans.ItemDetails.Qty, &modelTrans.CustomerDetail.PhoneNumber, &modelTrans.CustomerDetail.Name, &modelTrans.CustomerDetail.ShippingAddress, &modelTrans.CustomerDetail.PostCode, &modelTrans.ItemDetails.Note, &modelTrans.DetailTrans.OrderID, &modelTrans.Status, &cA, &uA, &dA)

		if err != nil {
			return nil, err
		}
		data = append(data, modelTrans)
	}

	return
}

func (tr *transactionRepo) CancelPaymentUser(orderId string) error {
	client := http.Client{}
	var status int
	tx, err := tr.db.Begin()

	qry1 := "Select status_id from tb_transaksi Where order_id=$1"
	qry2 := "Update tb_transaksi Set status_id=$1 where order_id=$2"

	if err != nil {
		tx.Rollback()
		return err
	}

	err = tx.QueryRow(qry1, orderId).Scan(&status)

	if err != nil {
		tx.Rollback()
		return err
	}

	if status != 1 && status != 2 {
		tx.Rollback()
		return errors.New("payment not valid")
	}

	url := fmt.Sprintf("https://api.sandbox.midtrans.com/v2/%s/cancel", orderId)

	request, errReq := http.NewRequest("POST", url, nil)

	if errReq != nil {
		tx.Rollback()
		return errReq
	}

	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Accept", "application/json")
	request.SetBasicAuth(os.Getenv("SERVER_KEY"), "")

	res, errRes := client.Do(request)

	if errRes != nil {
		tx.Rollback()
		return errRes
	}

	if res.StatusCode != 200 {
		tx.Rollback()
		return errors.New("failed cancel payment")
	}

	_, err = tx.Exec(qry2, 5, orderId)

	if err != nil {
		tx.Rollback()
		return err
	}

	tx.Commit()

	return nil
}

func (tr *transactionRepo) ViewTransactionOwner(status string) (data []dto.TransDTO, err error) {
	qry := "Select * from tb_transaksi Where deleted_at IS NULL ORDER BY created_at DESC"
	row := &sql.Rows{}
	var cA, uA, dA any

	if status != "" {
		qry = "Select * from tb_transaksi Where status_id=$2 AND deleted_at IS NULL ORDER BY created_at DESC"
		row, err = tr.db.Query(qry, status)
	} else {
		row, err = tr.db.Query(qry)
	}

	if err != nil {
		return nil, err
	}

	for row.Next() {
		modelTrans := dto.TransDTO{}

		err = row.Scan(&modelTrans.Id, &modelTrans.ItemDetails.Id, &modelTrans.CustomerDetail.Id, &modelTrans.DetailTrans.GrossAmount, &modelTrans.ItemDetails.TypeProduct, &modelTrans.ItemDetails.Qty, &modelTrans.CustomerDetail.PhoneNumber, &modelTrans.CustomerDetail.Name, &modelTrans.CustomerDetail.ShippingAddress, &modelTrans.CustomerDetail.PostCode, &modelTrans.ItemDetails.Note, &modelTrans.DetailTrans.OrderID, &modelTrans.Status, &cA, &uA, &dA)

		if err != nil {
			return nil, err
		}

		data = append(data, modelTrans)
	}

	return
}

func (tr *transactionRepo) UpdateStatus(orderId string, newStatusID int) (err error) {
	qry := "Update tb_transaksi Set status_id=$1,updated_at=$2 Where order_id=$3"
	_, err = tr.db.Exec(qry, newStatusID, time.Now(), orderId)

	return
}

func (tr *transactionRepo) DeleteTransaction(orderId string) (err error) {
	qry := "Update tb_transaksi Set updated_at=$1,deleted_at=$2 Where order_id=$3"
	_, err = tr.db.Exec(qry, time.Now(), time.Now(), orderId)

	return
}

func NewTransactionRepo(db *sql.DB) TransactionRepo {
	return &transactionRepo{db}
}
