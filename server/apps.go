package main

import "github.com/kriserohalia/SI-COMPANY-PROFILE/server/driver"

func main() {

	srv := driver.NewServer()

	srv.Run()

}