document.addEventListener('DOMContentLoaded', function () {

    const addPortfolioForm = document.getElementById('addPortfolioForm');
    const editPortfolioForm = document.getElementById('editPortfolioForm');

    // Fetch data and display in table
    async function fetchData(){
        try {
            const response = await fetch('http://localhost:8081/api-putra-jaya/portfolio/list');
            const data = await response.json();
            console.log(data); // Memeriksa struktur respons
    
            const table = document.getElementById('table-portfolio');
            
            // Kosongkan isi tbody saja, bukan seluruh tabel
            const tableBody = table.querySelector('tbody');
            tableBody.innerHTML = ''; 
    
            // Periksa apakah respons berisi array
            const items = data.data || []; // Misal: data.data adalah array yang berisi data
    
            // Periksa apakah items adalah array
            if (Array.isArray(items)) {
                items.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.id}</td>
                        <td>${item.service_id}</td>
                        <td>${item.project_name}</td>
                        <td>${item.project_description}</td>
                        <td>${item.project_date}</td>
                        <td><img src="${item.project_image}" alt="${item.project_name}" width="50" /></td>
                        <td>
                        <div class="form-button-action">
                            <button type="button" class="btn btn-link btn-primary btn-lg edit-button" data-product-id="${item.id}" title="Edit Task">
                            <i class="fa fa-edit"></i>
                            </button>
                            <button type="button" class="btn btn-link btn-danger delete-button" data-product-id="${item.id}" title="Remove">
                            <i class="fa fa-times"></i>
                            </button>
                        </div>
                        </td>

                    `;
                    tableBody.appendChild(row);
                });
            } else {
                console.error('Data is not an array:', items);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
            // Add new portfolio
    if (addPortfolioForm) {
        addPortfolioForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const serviceId = document.getElementById('addService').value;
            const name = document.getElementById('addName').value;
            const description = document.getElementById('addDeskripsi').value;
            const image = document.getElementById('addFoto').files[0];
            const date = document.getElementById('addTanggal').value;

            const formData = new FormData();
            formData.append('service_id', serviceId);
            formData.append('project_name', name);
            formData.append('project_description', description);
            formData.append('project_image', image);
            formData.append('project_date', date);

            try {
                const response = await fetch('http://localhost:8081/api-putra-jaya/portfolio/add', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                alert('Portfolio added successfully');
                addPortfolioForm.reset();
                const addPortfolioModal = bootstrap.Modal.getInstance(document.getElementById('addRowModal'));
                addPortfolioModal.hide();
                fetchData();
            } catch (error) {
                console.error('Error adding portfolio:', error);
                alert('Failed to add portfolio');
            }
        });
    }

    // Edit portfolio
    window.editPortfolio = async function (id) {
        try {
            const response = await fetch(`http://localhost:8081/api-putra-jaya/portfolio/${id}`);
            const data = await response.json();

            document.getElementById('EditInputIdService').value = data.service_id;
            document.getElementById('EditInputName').value = data.project_name;
            document.getElementById('EditInputDescription').value = data.project_description;
            document.getElementById('EditInputFoto').value = data.project_image;
            document.getElementById('EditInputTanggal').value = data.project_date;
            editPortfolioForm.dataset.portfolioId = id;

        } catch (error) {
            console.error('Error fetching portfolio data:', error);
        }
    };

    if (editPortfolioForm) {
        editPortfolioForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const id = editPortfolioForm.dataset.portfolioId;

            const serviceId = document.getElementById('EditInputIdService').value;
            const name = document.getElementById('EditInputName').value;
            const description = document.getElementById('EditInputDescription').value;
            const image = document.getElementById('EditInputFoto').files[0];
            const date = document.getElementById('EditInputTanggal').value;

            const formData = new FormData();
            formData.append('service_id', serviceId);
            formData.append('project_name', name);
            formData.append('project_description', description);
            formData.append('project_image', image);
            formData.append('project_date', date);

            try {
                const response = await fetch(`http://localhost:8081/api-putra-jaya/portfolio/update/${id}`, {
                    method: 'PUT',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                alert('Portfolio updated successfully');
                const editPortfolioModal = bootstrap.Modal.getInstance(document.getElementById('editPortfolioModal'));
                editPortfolioModal.hide();
                fetchData();
            } catch (error) {
                console.error('Error updating portfolio:', error);
                alert('Failed to update portfolio');
            }
        });
    }

    // Delete portfolio
    window.deletePortfolio = function (id) {
        if (confirm('Are you sure you want to delete this portfolio?')) {
            fetch(`http://localhost:8081/api-putra-jaya/portfolio/delete/${id}`, {
                method: 'DELETE',
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    alert('Portfolio deleted successfully');
                    fetchData();
                })
                .catch(error => {
                    console.error('Error deleting portfolio:', error);
                    alert('Failed to delete portfolio');
                });
        }
    };

    // Fetch data initially
    fetchData();
});
