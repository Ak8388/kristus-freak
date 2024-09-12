document.addEventListener('DOMContentLoaded', function () {
    const editPortfolioForm = document.getElementById('editPortfolioForm');
    const addPortfolioForm = document.getElementById('addPortfolioForm');
    const addPortfolioBtn = document.querySelector('[data-bs-target="#addPortfolioModal"]');

    fetchData()
    if (addPortfolioBtn) {
        addPortfolioBtn.addEventListener('click', function () {
            const addPortfolioModal = new bootstrap.Modal(document.getElementById('addPortfolioModal'), {
                backdrop: 'static',
                keyboard: false
            });
            addPortfolioModal.show();
        });

    }
    // Add new portfolio
    if (addPortfolioForm) {
        addPortfolioForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const serviceId = document.getElementById('addService').value;
            const name = document.getElementById('addName').value;
            const description = document.getElementById('addDeskripsi').value;
            const image = document.getElementById('addFoto');
            const date = document.getElementById('addTanggal').value;

            const formData = new FormData();

            if (project_image.files.length > 0) {
                formData.append('project_image', image.files[0]);
            }

            const Data = {
                'service_id': parseInt(serviceId),
                'project_name': name,
                'project_description': description,
                'project_date': date,

            };

            formData.append('json', JSON.stringify(Data));

            try {
                const response = await fetch('http://localhost:8081/api-putra-jaya/portfolio/add', {
                    method: 'POST',
                    headers: {
                        // 'Authorization': 'Bearer' + token
                    },
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
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
});

async function fetchData() {
    try {
        const response = await fetch('http://localhost:8081/api-putra-jaya/portfolio/list');
        const data = await response.json();
        console.log(data); // Memeriksa struktur respons

        const tableBody = document.getElementById('tbody');
        tableBody.innerHTML = '';
        const items = data.data || [];

        if (Array.isArray(items)) {
            items.forEach(item => {
                console.log(item.id);

                const row = document.createElement('tr');
                row.innerHTML = `
                        <td>${item.id}</td>
                        <td>${item.service_id}</td>
                        <td>${item.project_name}</td>
                        <td>${item.project_description}</td>
                        <td>${item.project_date}</td>
                        <td><img class="img-prod" src="../../server/${item.project_image}" style="width: 100px; height: auto;" /></td>
                        <td>
                            <div class="form-button-action">
                                <button type="button" class="btn btn-link btn-primary btn-lg edit-button" data-id="${item.id}" title="Edit Task" onclick="editPortfolio(${item.id})">
                                    <i class="fa fa-edit"></i>
                                </button>
                                <button type="button" class="btn btn-link btn-danger delete-button" data-id="${item.id}" title="Remove" onclick="removeData(${item.id})">
                                    <i class="fa fa-times"></i>
                                </button>
                            </div>
                        </td>
                    `;
                tableBody.appendChild(row);
            });

            // Add event listeners for edit and delete buttons
        } else {
            console.error('Data is not an array:', items);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


// 
document.querySelectorAll('.edit-button').forEach(button => {
    button.addEventListener('click', function () {
        const id = this.getAttribute('data-id');
        editPortfolio(id);
    });
});

document.querySelectorAll('.delete-button').forEach(button => {
    button.addEventListener('click', function () {
        const id = this.getAttribute('data-id');
        showDeleteConfirmation(id);
    });
});
// 

window.editPortfolio = async function (id) {
    try {
        const response = await fetch(`http://localhost:8081/api-putra-jaya/portfolio/${id}`);
        const data = await response.json();
        console.log("Data :",data);
        document.getElementById('EditInputIdService').value = data.data.service_id;
        document.getElementById('EditInputName').value = data.data.project_name;
        document.getElementById('EditInputDescription').value = data.data.project_description;  
        const pd = data.data.project_date.split("T");
        document.getElementById('EditInputTanggal').value = pd[0];
        document.getElementById('editPortfolioForm').dataset.portfolioId = data.data.id;

        const editPortfolioModal = new bootstrap.Modal(document.getElementById('editPortfolioModal'), {
            backdrop: 'static', // Mengatur backdrop
            keyboard: false // Mengatur keyboard interaction
        });
        editPortfolioModal.show();

    } catch (error) {
        console.error('Error fetching portfolio data:', error);
    }

}

window.removeData = async function(id){
    const token = localStorage.getItem('token');
    try{
        const response = await fetch(`http://localhost:8081/api-putra-jaya/portfolio/delete/${id}`,{method:"DELETE",headers:{"Authorization":"Bearer "+token}});
    
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log("Result", data);

        fetchData()
        alert('success delete data');
    }catch(error){
        alert(error);
    }
}

document.addEventListener('click', function (event) {
    if (event.target.closest('.edit-button')) {
        const portfolioId = event.target.closest('.edit-button').getAttribute('data-product-id');
        editPortfolio(portfolioId);
    }
});

document.getElementById('saveEditButton').addEventListener('click', async function () {
    const editPortfolioForm = document.getElementById('editPortfolioForm');
    const token = localStorage.getItem('token');
    const id = editPortfolioForm.dataset.portfolioId;

    const idService = document.getElementById('EditInputIdService').value;
    const name = document.getElementById('EditInputName').value;
    const date = document.getElementById('EditInputTanggal').value;
    const desc = document.getElementById('EditInputDescription').value;
    const foto = document.getElementById('EditInputFoto');

    const formData = new FormData();

    if (foto.files.length > 0) {
        formData.append('project_image', image.files[0]);
    }

    const Data = {
        'service_id': parseInt(idService),
        'project_name': name,
        'project_description': desc,
        'project_date': date,

    };

    formData.append('json', JSON.stringify(Data));

    try {
        const response = await fetch(`http://localhost:8081/api-putra-jaya/portfolio/update/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': "Bearer" + token
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Portfolio edited successfully:', result);
        alert('Portfolio updated successfully');
        editPortfolioForm.reset();
        const editPortfolioModal = bootstrap.Modal.getInstance(document.getElementById('editPortfolioModal'));
        editPortfolioModal.hide();
        fetchData();
    } catch (error) {
        console.error('Error updating portfolio:', error);
        alert('Failed to update portfolio');
    }

});

document.addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('delete-button')) {
        const id = event.target.getAttribute('data-product-id');
        showDeleteConfirmation(id);
    }
});


// Show delete confirmation
function showDeleteConfirmation(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!'
    }).then((result) => {
        if (result.isConfirmed) {
            deletePortfolio(id);
        }
    });
}

// Delete portfolio
function deletePortfolio(id) {

    fetch(`http://localhost:8081/api-putra-jaya/portfolio/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization' : 'Bearer' + token

        }
    })
        .then(response => {
            // Cek apakah status bukan 200
            if (response.status !== 200) {
                Swal.fire({
                    title: 'Error!',
                    text: `HTTP error! Status: ${response.status}`,
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(response => {
            // Jika penghapusan berhasil, tampilkan pesan sukses
            Swal.fire(
                'Deleted!',
                'Your product has been deleted.',
                'success'
            ).then(() => {
                // Refresh data produk setelah berhasil menghapus
                fetchData();
            });
        })
        .catch(error => {
            // Tampilkan pesan error jika gagal
            Swal.fire(
                'Error!',
                'Failed to delete product.',
                'error'
            );
            console.error('Error deleting product:', error);
        });
}

