document.addEventListener('DOMContentLoaded', function () {
    const addServiceForm = document.getElementById('addServiceForm');
    const editServiceForm = document.getElementById('editServiceForm');

    fetchData();
    
    document.getElementById('addRowButton').addEventListener('click', async function (event) {
        const token = localStorage.getItem('token');
    
        event.preventDefault();
        const name = document.getElementById('addName').value;
        const description = document.getElementById('addDeskripsi').value;
    
        try {
            const response = await fetch(`http://localhost:8081/api-putra-jaya/service/add`, {
                method: "POST",
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json' // Tambahkan header ini
                },
                body: JSON.stringify({ name: name, description: description }) // Sesuaikan dengan nama properti yang diharapkan oleh server
    
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            alert('Service added successfully!');
            window.location.reload(); // Segarkan halaman setelah menambahkan layanan
        } catch (error) {
            console.error('Error adding service:', error);
            alert('Failed to add service');
        }
    });
    
    async function fetchData() {
        try {
            const response = await fetch(`http://localhost:8081/api-putra-jaya/service/list`);
            const data = await response.json();
            const table = document.getElementById('table-service');
            table.innerHTML = ''; // Clear the table

            const tableHead = `
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Deskripsi</th>
                        <th style="width: 10%">Aksi</th>
                    </tr>
                </thead>
            `;
            table.innerHTML = tableHead;

            const tableBody = document.createElement('tbody');
            const items = data.data || [];

            if (items.length > 0) {
                items.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.id}</td>
                        <td>${item.name}</td>
                        <td>${item.description}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editService(${item.id})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="showDeleteConfirmation(${item.id})">Delete</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            } else {
                tableBody.innerHTML = '<tr><td colspan="4">No data available</td></tr>';
            }

            table.appendChild(tableBody);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    
    window.editService = async function (id) {
        const token = localStorage.getItem('token');
    
        try {
            console.log('Fetching service data...');
    
            const response = await fetch(`http://localhost:8081/api-putra-jaya/service/${id}`, {
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            console.log('Service data fetched successfully');
            const service = await response.json();
            console.log('Service data:', service);

    
            document.getElementById('EditInputName').value = service.data.name || '';
            document.getElementById('EditInputDescription').value = service.data.description || '';


           const edit =  document.getElementById('editServiceForm');
           edit.dataset.serviceId = id;

            console.log('Name input value after setting:', document.getElementById('EditInputName').value);
            console.log('Description input value after setting:', document.getElementById('EditInputDescription').value);
    
            console.log('Showing modal...');
            const editServiceModal = new bootstrap.Modal(document.getElementById('editServiceModal'));
            editServiceModal.show();
    
        } catch (error) {
            console.error('Error fetching service data:', error);
            alert('Failed to fetch service data. Please try again later.');
        }
    };


    
    document.getElementById('saveEditButton').addEventListener('click', async function (event) {
        event.preventDefault();
        const token = localStorage.getItem('token');
        const id = document.getElementById('editServiceForm').dataset.serviceId;
        const name = document.getElementById('EditInputName').value;
        const description = document.getElementById('EditInputDescription').value;
    
        try {
            const response = await fetch(`http://localhost:8081/api-putra-jaya/service/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'  // Add Content-Type header
                },
                body: JSON.stringify({ name: name, description: description })
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const result = await response.json();
            console.log('Service edited successfully:', result);
            alert('Service updated successfully!');
            console.log('Service edited successfully:', result);

            document.getElementById('editServiceForm').reset();
            const editServiceModal = bootstrap.Modal.getInstance(document.getElementById('editServiceModal'));
            editServiceModal.hide();
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Error updating service:', error);
            alert('Failed to update service');
        }
    });
    
});



function showDeleteConfirmation(id) {
    swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",  // Menggunakan "icon" bukan "type"
        buttons: {
            cancel: {
                text: "No, cancel!",
                value: false,
                visible: true,
                className: "btn btn-danger",
                closeModal: true,
            },
            confirm: {
                text: "Yes, delete it!",
                value: true,
                visible: true,
                className: "btn btn-primary",
                closeModal: false // Biarkan terbuka sampai kita selesai
            }
        },
        dangerMode: true,
    }).then((isConfirm) => {
        if (isConfirm) {
            deleteService(id);
        }
    });
}



function deleteService(id) {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8081/api-putra-jaya/service/delete/${id}`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then( () => {
        swal({
            title: 'Deleted!',
            text: 'Service has been deleted.',
            icon: 'success'
        }).then(() => {
            window.location.reload(); // Refresh data setelah penghapusan berhasil
        });
    })
    .catch(error => {
        swal({
            title: 'Error!',
            text: 'Failed to delete service.',
            icon: 'error'
        });
        console.error('Error deleting service:', error);
    });
}

