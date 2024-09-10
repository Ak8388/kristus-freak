package repository

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
)

type PortfolioRepo interface {
	AddPortfolio(model.Portfolio) error
	FindById(Id int) (model.Portfolio, error)
	List() ([]model.Portfolio, error)
	Delete(Id int) error
	Update(Id int, ProjectName, ProjectDescription, ProjectImage, ProjectDate string) error
}

type portfolioRepo struct {
	db *sql.DB
}

// AddPortfolio implements PortfolioRepo.
func (p *portfolioRepo) AddPortfolio(resp model.Portfolio) error {
	query := "INSERT INTO portfolio (service_id, project_name,project_description,project_image,project_date,created_at) VALUES ($1,$2,$3,$4,$5,$6)"
	_, err := p.db.Exec(query, resp.IdService, resp.ProjectName, resp.ProjectDescription, resp.ProjectImage, resp.ProjectDate, resp.CreatedAt)
	return err
}

// Delete implements PortfolioRepo.
func (p *portfolioRepo) Delete(Id int) error {
	query := "UPDATE portfolio SET updated_at=$1, deleted_at=$2 WHERE id=$3"
	_, err := p.db.Exec(query, time.Now(), time.Now(), Id)
	return err
}

// FindById implements PortfolioRepo.
func (p *portfolioRepo) FindById(Id int) (resp model.Portfolio, err error) {
	query := "SELECT * FROM portfolio WHERE id=$1"
	err = p.db.QueryRow(query, Id).Scan(&resp.Id, &resp.IdService, &resp.ProjectName, &resp.ProjectDescription, &resp.ProjectImage, &resp.ProjectDate, &resp.CreatedAt, &resp.UpdatedAt, &resp.DeletedAt)

	return
}

// List implements PortfolioRepo.
func (p *portfolioRepo) List() (resp []model.Portfolio, err error) {
	query := "SELECT id,service_id,project_name,project_description,project_image,project_date,created_at,updated_at,deleted_at FROM portfolio WHERE deleted_at IS NULL"

	rows, err := p.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("error querying the database : %v", err)

	}
	defer rows.Close()

	for rows.Next() {
		var detail model.Portfolio
		err := rows.Scan(
			&detail.Id,
			&detail.IdService,
			&detail.ProjectName,
			&detail.ProjectDescription,
			&detail.ProjectImage,
			&detail.ProjectDate,
			&detail.CreatedAt,
			&detail.UpdatedAt,
			&detail.DeletedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning row : %v", err)
		}
		resp = append(resp, detail)
	}
	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("Error after iterating rows:%v", err)
	}

	if len(resp) == 0 {
		emptyResponse := map[string]interface{}{
			"message": "nothing data created",
			"data":    []model.Portfolio{},
		}
		emptyResponseJSON, _ := json.Marshal(emptyResponse)
		fmt.Println(string(emptyResponseJSON))
		return nil, nil

	}
	return resp, nil
}

// Update implements PortfolioRepo.
func (p *portfolioRepo) Update(Id int, ProjectName string, ProjectDescription string, ProjectImage string, ProjectDate string) error {

	query := "UPDATE portfolio SET project_name=$1, project_description=$2, project_image=$3, project_date=$4, updated_at=$5 WHERE id=$6"
	_, err := p.db.Exec(query, ProjectName, ProjectDescription, ProjectImage, ProjectDate, time.Now(), Id)
	return err

}

func NewPortfolioRepo(db *sql.DB) PortfolioRepo {
	return &portfolioRepo{db: db}
}
