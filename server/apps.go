package main

import (
	"github.com/kriserohalia/company_profile/driver"
)

func main() {

	srv:= driver.NewServer()

	srv.Run()

}