document.addEventListener('DOMContentLoaded', function(){
    const addCustom = document.getElementById('addCustom');
    const showDataBtn = document.getElementById('showDataBtn');
    const addCustomForm = document.getElementById('addCustomForm');
    const urlParams = new URLSearchParams(window.location.search);
    const customId = urlParams.get('id');
    const editCustomForm = document.getElementById('editCustomForm');

    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function(){
            const customId = this.getAttribute('data-custom-id');
            editCustomForm(customId);
        });
    });

    if (customId) {
        fetchCustomData(customId);
    }
    
    if (showDataBtn) {
        showDataBtn.addEventListener('click', function() {
            fetchData();
            if(addCustom) {
                addCustom.style.display = 'inline'
            }
        });
    }

    if(addCustom){
        addCustom.addEventListener('click', function(){
            const addDetailModal = new bootstrap.Modal(document.getElementById('addDetailModal'),{
                backdrop:'static',
                keyboard:false
            });
            addCustomModal.show();
        });
    }

    if(addCustomForm){
        addCustomForm.addEventListener('submit', async function(event){
            event.preventDefault();

            const idCategory = document.getElementById('InputIdCategory').value;
            // const idCategory = document.getElementById('InputIdCategory').value;
            // const idCategory = document.getElementById('InputIdCategory').value;
            // const idCategory = document.getElementById('InputIdCategory').value;
            // const idCategory = document.getElementById('InputIdCategory').value;
            // const idCategory = document.getElementById('InputIdCategory').value;
            // const idCategory = document.getElementById('InputIdCategory').value;

            const token = localStorage.getItem('token');
            console.log(token);


            if (!token) {
                alert('akses dibatasi');
                return;
            }

            try {
                const response = await fetch('http://localhost:8081/api-putra-jaya/custom/add', {
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization':`Bearer ${token}`

                    },
                    body: JSON.stringify({

                    })
                    
                });
                if (!response.ok){
                    throw new Error (`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                console.log('Product added successfully:', result);
                alert('Product added successfully!');
                addCustomForm.reset();
                const addCustomModal = boostrap.Modal.getInstance(document.getElementById('addCustomModal'));
                addCustomModal.hide();
                fetchData();
            } catch (error) {
                console.error('Error adding product:', error);
                alert('Failed to add product.');
            }
        });
    }

    if (editCustomForm){
        editCustomForm.addEventListener('submit', async function(event){
            event.preventDefault();
            const idCategory = document.getElementById('InputIdCategory').value;
            try {
                const response = await fetch(`http://localhost:8081/api-putra-jaya/custom/update/${id}`,{
                    method:'PUT',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({

                    })
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
      
                const result = await response.json();
                console.log('Product edited successfully:', result);
                alert('Product edited successfully!');
                editCustomForm.reset();
                const editCustomModal = boostrap.Modal.getInstance(document.getElementById('editCustomModal'));
                editCustomModal.hide();
                fetchData();
            } catch (error) {
                console.error('Error editing product:', error);
                alert('Failed to edit product.');
                
            }
        });
    }

});

function deleteCustom(id){
    if(confirm('Are you sure you want to delete this product?')){
        fetch(`http://localhost:8081/api-putra-jaya/custom/delete/${id}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            console.log('Product deleted successfully:', result);
            alert('Product deleted successfully!');
            // Refresh data produk setelah berhasil menghapus
            fetchData();
        })
        .catch(error => {
            console.error('Error deleting product:', error);
            alert('Failed to delete product.');
        });
    }
}

async function fetchData(){
    try {
        const response = await fetch ('http://localhost:8081/api-putra-jaya/custom/list');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log(data);
        const table = document.getElementById('table-detail');
         // Kosongkan tabel sebelumnya

        const tableHead = document.createElement('thead');
        tableHead.innerHTML = `
            <tr>
                <th>Id Category</th>
                <th>ID Produk</th>
                <th>ID Category</th>
                <th>Name Category</th>
                <th>Name</th>
                <th>Price</th>
                <th>Photo</th>
                <th>Stock</th>
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
                    <td>${item.id_produk}</td>
                    <td>${item.produk_dto.id_category}</td>
                    <td>${item.produk_dto.category_dto.name}</td>
                    <td>${item.produk_dto.name}</td>
                    <td>${item.price}</td>
                    <td><img src="${item.photos}" alt="Photo" style="width: 100px; height: auto;"></td>
                    <td>${item.stock}</td>
                    <td>${item.description}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editDetail(${item.id})">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteDetail(${item.id})">Delete</button>
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

window.editCustom = async function(id){
    try {
        const response = await fetch (`http://localhost:8081/api-putra-jaya/custom/${id}`);
        const detail = await response.json();
        console.log(detail);

        document.getElementById('editCustomIdCategory').value = detail.id_category;
         
         editCustomForm.dataset.customId = id;

         const editCustomModal = new bootstrap.Modal(document.getElementById('editCustomModal'), {
            backdrop:'static',
            keyboard:false
         });
         editCustomModal.show();
    } catch (error) {
        console.error('Error fetching product data:', error);
        
    }
};

async function fetchCustomData(id) {
    try {
        const response = await fetch(`http://localhost:8081/api-putra-jaya/custom/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        document.getElementById('editCustomIdCategory').value = data.id_category;

        const editCustomForm = document.getElementById('editCustomForm');
        editCustomForm.setAttribute('data-id', id);
    } catch (error) {
        console.error('Error fetching detail product:', error);
    }
}


