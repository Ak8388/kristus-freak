package repository

import (
	"database/sql"

	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
)

type CouponRepository interface {
	CouponAdd(model.CouponModel) error
	CouponGet(model.CouponModel) ([]model.CouponModel, error)
	CouponUpdate(model.CouponModel) error
	CouponDelete(id string) error
}

type couponRepo struct {
	db *sql.DB
}

func (coupon *couponRepo) CouponAdd(couponReq model.CouponModel) error {
	qry := "Insert Into coupon_used (id_user,code,discount) Values($1,$2,$3)"
	_, err := coupon.db.Exec(qry, couponReq.IdUser, couponReq.Code, couponReq.Discount)

	return err
}

func (coupon *couponRepo) CouponGet(couponReq model.CouponModel) (data []model.CouponModel, err error) {
	qry := "select * from coupon_used Where id_user=$1"
	row, err := coupon.db.Query(qry, couponReq.IdUser)

	if err != nil {
		return nil, err
	}

	for row.Next() {
		couponRow := model.CouponModel{}

		err = row.Scan(&couponRow.ID, &couponRow.IdUser, &couponRow.Code, &couponRow.Discount)

		if err != nil {
			return nil, err
		}

		data = append(data, couponRow)
	}

	return
}

func (coupon *couponRepo) CouponUpdate(couponReq model.CouponModel) error {
	qry := "Update coupon_used Set code=$1, discount=$2 Where id=$3"

	_, err := coupon.db.Exec(qry, couponReq.Code, couponReq.Discount, couponReq.ID)

	if err != nil {
		return err
	}

	return err
}

func (coupon *couponRepo) CouponDelete(id string) error {
	qry := "delete from coupon_used where id=$1"

	_, err := coupon.db.Exec(qry, id)

	return err
}

func NewCouponRepo(db *sql.DB) CouponRepository {
	return &couponRepo{db}
}
