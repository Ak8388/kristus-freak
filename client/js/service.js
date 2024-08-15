document.addEventListener('DOMContentLoaded',function(){

    const fetchDataBtn = document.getElementById('fetchService');
    const addService = document.getElementById('addService');
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('id');
    const addServiceForm = document.getElementById('addServiceForm');
    const editServiceForm = document.getElementById('editServiceForm');
    const showDataBtn = document.getElementById('showDataBtn');


    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function(){
            const serviceId = this.getAttribute('data-service-id');
            editServiceForm(serviceId);
        });
    });

    if(serviceId){
        fetchServiceData(serviceId)
    }

    // if(fetchDataBtn){
    //     fetchDataBtn.addEventListener('click', async function(event) {
    //         // event.preventDefault();
    //         // fetchData();
    //         // addService.style.display = 'inline';
    //         fetchData();
    //         if(addService){
    //             addService.style.display = 'inline';
    //         }
    //     });
    // }

    if (showDataBtn) {
        showDataBtn.addEventListener('click', function() {
            fetchData();
            if(addService) {
                addService.style.display = 'inline'
            }
        });
    }

    if(addService){
        addService.addEventListener('click', function(){
            const addServiceModal = new bootstrap.Modal(document.getElementById('addServiceModal'),{
                backrop:'static',
                keyboard:false
            });
            addServiceModal.show();
        });
    }

    if(addServiceForm){
        addServiceForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const name = document.getElementById('InputName').value;
            const description = document.getElementById('InputDescription').value;

            try {
                const response = await fetch('http://localhost:8081/api-putra-jaya/service/add',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({service_name:name,service_description:description})
                });

                if (!response.ok){
                    throw new Error(`HTTP error! Status: ${response.status}`);

                }

                const result = await response.json();
                console.log('Service added successfully:', result);
                alert('Service added successfully:');
                addServiceForm.reset();

                const addServiceModal = bootstrap.Modal.getInstance(document.getElementById('addServiceModal'));
                addServiceModal.hide();
                fetchData();
            } catch (error) {
                console.error('Error adding service', error);
                alert('Failed to add service');
                
            }
            
        });
    }

    if (editServiceForm){
        editServiceForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const id = editServiceForm.dataset.serviceId;
            const name = document.getElementById('EditName').value;
            const description = document.getElementById('EditDescription').value;

            try {
                const response = await fetch(`http://localhost:8081/api-putra-jaya/service/update/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify({service_name:name,service_description:description})
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                console.log('Service edited successfully:', result);
                alert('Service edited successfully!');
                editServiceForm.reset();
                const editServiceModal = bootstrap.Modal.getInstance(document.getElementById('editServiceModal'));
                editServiceModal.hide();
                fetchData();
            } catch (error) {
                console.error('Error editing service:', error);
                alert('Failed to edit service.');

            }
            
        });
    }

});

async function fetchData(){
    try {
        const response = await fetch('http://localhost:8081/api-putra-jaya/service/list');
        const data = await response.json();
        console.log(data);
        const table = document.getElementById('table-service');
        const tableHead = document.createElement('thead');
        tableHead.innerHTML = `
            <tr>
            <th>ID</th>
            <th>Company Id</th>
            <th>Name</th>
            <th>Description</th>
            <th>Aksi</th>
            </tr>    
        `;

    table.innerHTML = '';
    table.appendChild(tableHead);
    const tableBody = document.createElement('tbody');
    const items = data.data || []; // Mengakses array data dari respons

    if (Array.isArray(items)) {
        items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.company_id}</td>
                <td>${item.service_name}</td>
                <td>${item.service_description}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editService (${item.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteService(${item.id})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } else {
        console.error('Items is not an array:', items);
    }

    table.appendChild(tableBody);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
// fetchData();


    window.editService = async function(id) {
        console.log(id);
        try {
            const response = await fetch(`http://localhost:8081/api-putra-jaya/service/${id}`);
            const product = await response.json();
            console.log(product);

            // Isi form edit dengan data produk
            document.getElementById('EditName').value = product.service_name;
            document.getElementById('EditDescription').value = product.service_description;
            editServiceForm.dataset.serviceId = id;


            const editServiceModal = new bootstrap.Modal(document.getElementById('editServiceModal'), {
                backdrop: 'static',
                keyboard: false
            });
            editServiceModal.show();
        } catch (error) {
            console.error('Error fetching service data:', error);
            console.log(id);

        }
    };

function deleteService(id) {
    console.log(id);
    if (confirm('Are you sure you want to delete this service?')) {
        fetch(`http://localhost:8081/api-putra-jaya/service/delete/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            console.log('Service deleted successfully:', result);
            alert('Service deleted successfully!');
            // Refresh data produk setelah berhasil menghapus
            fetchData();
        })
        .catch(error => {
            console.error('Error deleting service:', error);
            alert('Failed to delete service.');
        });
    }
}

async function fetchServiceData(id){
    try {
        const response = await fetch(`http://localhost:8081/api-putra-jaya/service/${id}`);

        if (!response.ok){
            throw new Error(`HTTP error! Status:${response.status}`);
        }

        const data = await response.json();

        document.getElementById('EditName').value = data.service_name;
        document.getElementById('EditDescription').value = data.service_description;
        const editForm = document.getElementById('editServiceForm');
        editForm.setAttribute('service-id', id);

    } catch (error) {
        console.error('Error fetching service data:', error);
    }
}