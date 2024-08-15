package helper

import (
	"errors"
	"os"

	"github.com/golang-jwt/jwt/v5"
)

func HelperGetRole(tokenString string) string {

	token,err:= jwt.Parse(tokenString,func(t *jwt.Token) (interface{}, error) {
		if t.Method != jwt.GetSigningMethod("HS256"){
			return nil, errors.New("cannot parsig token")
		}
		return []byte(os.Getenv("SECRET_KEY")),nil

	})

	if err!= nil {
		return err.Error()
	}

	mapClaims,ok:=token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return err.Error()

	}

	role := mapClaims["Role"].(string)

	return role


}