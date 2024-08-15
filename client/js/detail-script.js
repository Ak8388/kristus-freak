document.addEventListener('DOMContentLoaded', function() {
    const addDetail = document.getElementById('addDetail');
    const showDataBtn = document.getElementById('showDataBtn');
    const addDetailForm = document.getElementById('addDetailForm');
    const urlParams = new URLSearchParams(window.location.search);
    const detailId = urlParams.get('id');
    const editDetailForm = document.getElementById('editDetailForm');

    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function(){
            const detailId = this.getAttribute('data-detai-id');
            editDetailForm(detailId);
        });
    });

    if (detailId) {
        fetchDetailData(detailId);
    }
    
    if (showDataBtn) {
        showDataBtn.addEventListener('click', function() {
            fetchData();
            if(addDetail) {
                addDetail.style.display = 'inline'
            }
        });
    }

    if(addDetail){
        addDetail.addEventListener('click', function(){
            const addDetailModal = new bootstrap.Modal(document.getElementById('addDetailModal'),{
                backdrop:'static',
                keyboard:false
            });
            addDetailModal.show();
        });
    }

    if (addDetailForm){
        addDetailForm.addEventListener('submit', async function(event){
            event.preventDefault();

            const idProduk = document.getElementById('InputIdProduk').value;
            const price = document.getElementById('InputPrice').value;
            const photos = document.getElementById('InputPhotos').value;
            const stock = document.getElementById('InputStock').value;
            const description = document.getElementById('InputDescription').value;

            const token = localStorage.getItem('token');
            console.log(token);

            if (!token) {
                alert('akses dibatasi');
                return;
            }

            try {
                const response = await fetch('http://localhost:8081/api-putra-jaya/detail/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        id_produk:parseInt(idProduk,10),
                        price:parseInt(price,10),
                        photos:photos,
                        stock:parseInt(stock,10),
                        description:description
                    })
                });
                if (!response.ok){
                    throw new Error (`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                console.log('Product added successfully:', result);
                alert('Product added successfully!');
                addDetailForm.reset();
                const addDetailModal = bootstrap.Modal.getInstance(document.getElementById('addDetailModal'));
                addDetailModal.hide();
                fetchData();
            } catch (error) {
                console.error('Error adding product:', error);
                alert('Failed to add product.');
            }
        });
    }

    if (editDetailForm) {
         editDetailForm.addEventListener('submit', async function(event){
            event.preventDefault();
            const id = editDetailForm.dataset.detailId;
           const idProduk =  document.getElementById('editDetailIdProduk').value;
         const price = document.getElementById('editDetailInputPrice').value;
         const photos = document.getElementById('editDetailInputPhotos').value;
         const stock = document.getElementById('editDetailInputStock').value;
         const description = document.getElementById('editDetailInputDescription').value;
         try {
            const response = await fetch(`http://localhost:8081/api-putra-jaya/detail/update/${id}`, {
                method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                body:JSON.stringify({
                        id_produk:parseInt(idProduk,10),
                        price:parseInt(price,10),
                        photos:photos,
                        stock:parseInt(stock,10),
                        description:description
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
  
            const result = await response.json();
            console.log('Product edited successfully:', result);
            alert('Product edited successfully!');
            editDetailForm.reset();
            const editDetailModal = bootstrap.Modal.getInstance(document.getElementById('editDetailModal'));
            editDetailModal.hide();
            fetchData();

         } catch (error) {
            console.error('Error editing product:', error);
                alert('Failed to edit product.');
            
         }
         });
    }

});


function deleteDetail(id){
    if(confirm('Are you sure you want to delete this product?')){
        fetch(`http://localhost:8081/api-putra-jaya/detail/delete/${id}`,{
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

async function fetchData() {
    try {
        const response = await fetch('http://localhost:8081/api-putra-jaya/detail/list'); // URL endpoint
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log(data);
        const table = document.getElementById('table-detail');
         // Kosongkan tabel sebelumnya

        const tableHead = document.createElement('thead');
        tableHead.innerHTML = `
            <tr>
                <th>ID</th>
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


window.editDetail = async function(id){
    try {
        const response = await fetch (`http://localhost:8081/api-putra-jaya/detail/${id}`);
        const detail = await response.json();
        console.log(detail);

        document.getElementById('editDetailIdProduk').value = detail.id_produk;
         document.getElementById('editDetailInputPrice').value= detail.price;
         document.getElementById('editDetailInputPhotos').value = detail.photos;
         document.getElementById('editDetailInputStock').value = detail.stock;
         document.getElementById('editDetailInputDescription').value = detail.description;
         editDetailForm.dataset.detailId = id;

         const editDetailModal = new bootstrap.Modal(document.getElementById('editDetailModal'), {
            backdrop:'static',
            keyboard:false
         });
         editDetailModal.show();
    } catch (error) {
        console.error('Error fetching product data:', error);
        
    }
};

async function fetchDetailData(id) {
    try {
        const response = await fetch(`http://localhost:8081/api-putra-jaya/detail/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        document.getElementById('editDetailIdProduk').value = data.id_produk;
        document.getElementById('editDetailInputPrice').value = data.price;
        document.getElementById('editDetailInputPhotos').value = data.photos;
        document.getElementById('editDetailInputStock').value = data.stock;
        document.getElementById('editDetailInputDescription').value = data.description;

        const editDetailForm = document.getElementById('editDetailForm');
        editDetailForm.setAttribute('data-id', id);
    } catch (error) {
        console.error('Error fetching detail product:', error);
    }
}

