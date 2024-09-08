package repository

import (
	"database/sql"
	"fmt"
	"strconv"
	"time"

	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
)

type BlogRepo interface {
	Add(model.Blog) error
	FindById(Id int) (model.Blog, error)
	List() ([]model.Blog, error)
	Update(model.Blog) error
	Delete(Id int) error
}

type blogRepo struct {
	db *sql.DB
}

// Add implements BlogRepo.
func (b *blogRepo) Add(resp model.Blog) error {
	query := "INSERT INTO article (title, content, author, image_url, status) VALUES ($1, $2, $3, $4, $5)"
	_, err := b.db.Exec(query, resp.Title, resp.Content, resp.Author, resp.Cover, 1)
	return err
}


// Delete implements BlogRepo.
func (b *blogRepo) Delete(Id int) error {
	query := "UPDATE article SET updated_at=$1,deleted_at=$2 WHERE id=$3"
	_, err := b.db.Exec(query, time.Now(), time.Now(),Id)
	return err
}

// FindById implements BlogRepo.
func (b *blogRepo) FindById(Id int) (resp model.Blog, err error) {
	query := "SELECT * FROM article WHERE id = $1"
	err = b.db.QueryRow(query, Id).Scan(&resp.Id, &resp.Title, &resp.Content, &resp.Author, &resp.Cover,&resp.CreatedAt, &resp.UpdatedAt, &resp.DeletedAt, &resp.IdStatus )
	return
}

// List implements BlogRepo.
func (b *blogRepo) List() (resp []model.Blog,err error) {
	query := "SELECT * FROM article WHERE deleted_at IS NULL"
	rows, err := b.db.Query(query)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next(){
		var blog model.Blog

		if err := rows.Scan(&blog.Id, &blog.Title, &blog.Content,&blog.Author, &blog.Cover, &blog.CreatedAt, &blog.UpdatedAt, &blog.DeletedAt, &blog.IdStatus); err != nil {
			return nil, err
		}

		resp = append(resp, blog)
	}

	return resp, nil
}

// Update implements BlogRepo.
func (b *blogRepo) Update(blog model.Blog) error {

	query := "UPDATE article SET title=$1,content=$2,author=$3,image_url=$4,updated_at=$6"
	index := 6
	var data []any
	fmt.Println(blog)
	data = append(data, blog.Id, blog.Title,blog.Content,blog.Author, time.Now())

	if blog.Cover != "" {
		index++
		query += ", image_url=$" + strconv.Itoa(index)
		data = append(data, blog.Cover)
	}

	index++
	query += "WHERE id=$" + strconv.Itoa(index)
	data = append(data, blog.Id)

	_, err := b.db.Exec(query, data...)

	return err
}

func NewBlogRepo(db *sql.DB) BlogRepo {
	return &blogRepo{
		db: db,
	}
}
