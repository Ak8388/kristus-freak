package config

import (
	"errors"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	DBConfig
	APIConfig
	JWTConfig
}

type DBConfig struct {
	DBUser     string
	DBPassword string
	DBName     string
	DBPort     string
}

type APIConfig struct {
	APIPort string
}

type JWTConfig struct {
	SecretKey  string
	IssuerName string
	Expire     time.Duration
}

func (cfg *Config) readConfig() error{
	if err := godotenv.Load(); err != nil{
		return err
	}

	cfg.APIConfig = APIConfig{
		APIPort: os.Getenv("API_PORT"),
	}

	cfg.DBConfig = DBConfig{
		DBUser:     os.Getenv("DB_USER"),
		DBPassword: os.Getenv("DB_PASSWORD"),
		DBName:     os.Getenv("DB_NAME"),
		DBPort:     os.Getenv("DB_PORT"),
	}

	expired,_ := strconv.Atoi(os.Getenv("JWT_EXPIRED"))

	cfg.JWTConfig = JWTConfig{
		SecretKey:  os.Getenv("SECRET_KEY"),
		IssuerName: os.Getenv("ISSUER_NAME"),
		Expire:     time.Duration(expired * int(time.Hour)),
	}

	if cfg.APIConfig.APIPort == "" || cfg.JWTConfig.Expire <= 0 || cfg.JWTConfig.IssuerName == "" || cfg.JWTConfig.SecretKey == "" || cfg.DBConfig.DBUser == "" || cfg.DBConfig.DBPassword == "" || cfg.DBConfig.DBName == "" || cfg.DBConfig.DBPort == ""{
		return errors.New("all environment required")
	}

	return nil
}

func Cfg() *Config {
	cfg := &Config{}

	if err:= cfg.readConfig();err != nil {
		panic(err);
	}

	return cfg
}
