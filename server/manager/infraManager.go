package manager

import (
	"database/sql"
	"fmt"

	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/config"
	_ "github.com/lib/pq"
)

type Inframanager interface {
	Connection() *sql.DB
}

type inframanager struct {
	cfg *config.Config
	db *sql.DB
}

func (infra *inframanager) openConnection() error{
	dsn := fmt.Sprintf("user=%s password=%s dbname=%s port=%s sslmode=disable",infra.cfg.DBUser, infra.cfg.DBPassword, infra.cfg.DBName, infra.cfg.DBPort)
	db,err := sql.Open("postgres",dsn)

	if err != nil {
		return err
	}

	if err := db.Ping();err !=nil{
		return err
	}

	infra.db=db
	return nil

}

func (infra * inframanager) Connection() *sql.DB {
	return infra.db
} 

func NewInfraManager( config *config.Config ) Inframanager{

	infra := &inframanager{
		cfg: config,
	}

	if err := infra.openConnection();err != nil {
		panic(err)
	}

	return infra


}