package repository

import (
	"database/sql"
	"net/smtp"
	"strconv"
	"time"

	"github.com/joho/godotenv"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
	"golang.org/x/exp/rand"
)

type AuthRepo interface {
	Login(email string) (model.ResponseLoginRepo, error)
	Register(regis model.Register) error
	ResetPassword(newPassword string, id int) error
	EmailVerify(email string) (string, error)
	ForgetPassword(email, newPasswordEncryp string) error
}

type authRepo struct {
	db *sql.DB
}

func (auth *authRepo) Login(email string) (resp model.ResponseLoginRepo, err error) {
	query := "SELECT id, email, password, role FROM tb_user WHERE email=$1 AND deleted_at IS NULL"
	err = auth.db.QueryRow(query, email).Scan(&resp.Id, &resp.Email, &resp.Password, &resp.Role)

	return
}

func (auth *authRepo) Register(regis model.Register) error {
	query := "INSERT INTO tb_user (name,email,password,role) values($1,$2,$3,$4)"
	_, err := auth.db.Exec(query, regis.Name, regis.Email, regis.Password, regis.Role)
	return err

}

func (auth *authRepo) ResetPassword(newPassword string, id int) error {
	query := "UPDATE tb_user SET password=$1, updated_at=$2 WHERE id=$3"
	_, err := auth.db.Exec(query, newPassword, time.Now(), id)
	return err
}

func (auth *authRepo) EmailVerify(email string) (string, error) {
	if err := godotenv.Load(); err != nil {
		return "", err
	}

	rand.Seed(uint64(time.Now().UnixNano()))
	min := 100000
	max := 999999

	randomValue := rand.Intn(max-min+1) + min
	plainTextContent := strconv.Itoa(randomValue)

	var (
		smtpHost     = "smtp.gmail.com"
		smtpPort     = "587"
		smtpUsername = "kriserhl907@gmail.com"
		smtpPassword = "knrt nkpf wbgu vrjt"
	)

	to := []string{email}
	subject := "Code Verification"
	body := plainTextContent

	aut := smtp.PlainAuth("", smtpUsername, smtpPassword, smtpHost)

	msg := []byte("To: " + to[0] + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"\r\n" +
		body + "\r\n")

	err := smtp.SendMail(smtpHost+":"+smtpPort, aut, smtpUsername, to, msg)

	if err != nil {
		return "", err
	}

	return plainTextContent, nil
}

func (authRepo *authRepo) ForgetPassword(email, newPasswordEncryp string) error {
	qry := "Update tb_user Set password=$1 Where email=$2"

	_, err := authRepo.db.Exec(qry, newPasswordEncryp, email)

	return err
}

func NewAuthRepo(db *sql.DB) AuthRepo {
	return &authRepo{db}

}
