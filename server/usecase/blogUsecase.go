package usecase

import (
	"errors"
	"time"

	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/repository"
)

type BlogUseCase interface {
	Add(model.Blog) error
	FindById(Id int) (model.Blog, error)
	List()([]model.Blog, error)
	Update(model.Blog) error
	Delete(Id int) error
}

type blogUsecase struct {
	rp repository.BlogRepo
}

// Add implements BlogUseCase.
func (b *blogUsecase) Add(blog model.Blog) error {

	now:= time.Now()
	if blog.CreatedAt == nil {
		blog.CreatedAt =  &now
	}

	publish:= time.Now()
	if blog.UpdatedAt == nil {
		blog.UpdatedAt = &publish
	}

	return b.rp.Add(blog)
}

// Delete implements BlogUseCase.
func (b *blogUsecase) Delete(Id int) error {
	resp, err := b.rp.FindById(Id)
	if err != nil {
		return err
	}

	if resp.DeletedAt != nil {
		return errors.New("blog is deleted")
	}

	err = b.rp.Delete(Id)
	if err != nil{
		return err
	}

	return err
}

// FindById implements BlogUseCase.
func (b *blogUsecase) FindById(Id int) (resp model.Blog, err error) {
	resp, err = b.rp.FindById(Id)
	if err != nil {
		return model.Blog{}, err
	}

	if resp.Id == 0{
		return model.Blog{}, errors.New("article is deleted")

	}

	return resp, nil
}

// List implements BlogUseCase.
func (b *blogUsecase) List() (resp []model.Blog, err error) {
	all, err := b.rp.List()
	if err != nil {
		return []model.Blog{}, err
	}

	for _, blog := range all {
		if blog.DeletedAt == nil {
			resp = append(resp, blog)
		}
	}

	if len(resp) == 0 {
		return []model.Blog{}, errors.New("NO article found")
	}

	return
}


// Update implements BlogUseCase.
func (b *blogUsecase) Update(blog model.Blog) error {

	blog, err := b.rp.FindById(blog.Id)
	if blog.Id == 0 {
		return errors.New("article is not found")
	}
	if err != nil {
		return err
	}

	if blog.DeletedAt != nil {
		return errors.New("article is deleted")
	}

	err = b.rp.Update(blog)
	if err != nil {
		return err
	}

	return err
}

func NewBlogUseCase(rp repository.BlogRepo) BlogUseCase {
	return &blogUsecase{rp}
}
