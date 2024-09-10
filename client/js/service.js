document.addEventListener('DOMContentLoaded', function () {
    const addRowButton = document.getElementById('addRowButton');
    const editServiceForm = document.getElementById('editServiceForm');
    const searchInput = document.getElementById('searchInput');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentPage = 1;
    const rowsPerPage = 5;

    // Fetch data and display on the table
    async function fetchData(page = 1, searchQuery = '') {
        try {
            const response = await fetch(`http://localhost:8081/api-putra-jaya/service/list?page=${page}&search=${searchQuery}`);
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
                            <button class="btn btn-danger btn-sm" onclick="deleteService(${item.id})">Delete</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            } else {
                tableBody.innerHTML = '<tr><td colspan="4">No data available</td></tr>';
            }

            table.appendChild(tableBody);

            // Update pagination controls
            document.getElementById('showing-info').innerText = `Showing page ${page} of ${data.totalPages}`;
            prevBtn.disabled = page === 1;
            nextBtn.disabled = page === data.totalPages;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Initial fetch
    fetchData(currentPage);

    // Search functionality
    searchInput.addEventListener('input', function () {
        const searchQuery = searchInput.value;
        fetchData(1, searchQuery);
    });

    // Pagination
    prevBtn.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            fetchData(currentPage);
        }
    });

    nextBtn.addEventListener('click', function () {
        currentPage++;
        fetchData(currentPage);
    });

    // Add new service
    addRowButton.addEventListener('click', async function () {
        const name = document.getElementById('addName').value;
        const description = document.getElementById('addDeskripsi').value;

        try {
            const response = await fetch('http://localhost:8081/api-putra-jaya/service/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: name, description: description })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            alert('Service added successfully!');
            fetchData(currentPage); // Refresh data
        } catch (error) {
            console.error('Error adding service:', error);
            alert('Failed to add service');
        }
    });

    // Edit service function
    window.editService = async function (id) {
        try {
            const response = await fetch(`http://localhost:8081/api-putra-jaya/service/${id}`);
            const service = await response.json();

            document.getElementById('EditInputName').value = service.service_name;
            document.getElementById('EditInputDescription').value = service.service_description;
            editServiceForm.dataset.serviceId = id;

            const editServiceModal = new bootstrap.Modal(document.getElementById('editServiceModal'), {
                backdrop: 'static',
                keyboard: false
            });
            editServiceModal.show();
        } catch (error) {
            console.error('Error fetching service data:', error);
        }
    };

    // Save edited service
    document.getElementById('saveEditButton').addEventListener('click', async function () {
        const id = editServiceForm.dataset.serviceId;
        const name = document.getElementById('EditInputName').value;
        const description = document.getElementById('EditInputDescription').value;

        try {
            const response = await fetch(`http://localhost:8081/api-putra-jaya/service/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ service_name: name, service_description: description })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            alert('Service updated successfully!');
            fetchData(currentPage); // Refresh data
        } catch (error) {
            console.error('Error updating service:', error);
            alert('Failed to update service');
        }
    });

    // Delete service function
    window.deleteService = async function (id) {
        if (confirm('Are you sure you want to delete this service?')) {
            try {
                const response = await fetch(`http://localhost:8081/api-putra-jaya/service/delete/${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                alert('Service deleted successfully!');
                fetchData(currentPage); // Refresh data
            } catch (error) {
                console.error('Error deleting service:', error);
                alert('Failed to delete service');
            }
        }
    };

});



