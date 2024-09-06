document.addEventListener('DOMContentLoaded', function() {

    const searchInput = document.getElementById('searchInput');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const showingInfo = document.getElementById('showing-info');

    let currentPage = 1;
    const rowsPerPage = 10;
    let dataItems = [];

    // Panggil fetchData saat halaman dimuat
    fetchData();

    // Event listener untuk input search
    searchInput.addEventListener('keyup', function() {
        const filter = searchInput.value.toLowerCase();
        const rows = document.querySelectorAll('#table-product tbody tr');

        rows.forEach(row => {
            const productName = row.cells[2].textContent.toLowerCase(); // Mengambil nilai dari kolom "Name"
            if (productName.indexOf(filter) > -1) {
                row.style.display = ''; // Tampilkan baris jika cocok
            } else {
                row.style.display = 'none'; // Sembunyikan baris jika tidak cocok
            }
        });
    });

    // Event listener untuk tombol prev dan next
    prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderTable(dataItems, currentPage);
        }
    });

    nextBtn.addEventListener('click', function() {
        const maxPage = Math.ceil(dataItems.length / rowsPerPage);
        if (currentPage < maxPage) {
            currentPage++;
            renderTable(dataItems, currentPage);
        }
    });

    async function fetchData() {
        try {
            const response = await fetch('http://localhost:8081/api-putra-jaya/product/list');
            const data = await response.json();
            dataItems = data.data || [];

            renderTable(dataItems, currentPage);
            updatePaginationInfo(dataItems.length);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Fungsi untuk menampilkan tabel sesuai dengan halaman saat ini
    function renderTable(data, page) {
        const tableBody = document.querySelector('#table-product tbody');
        tableBody.innerHTML = '';

        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedData = data.slice(start, end);

        paginatedData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.id_category}</td>
                <td>${item.name}</td>
                <td>${item.photos}</td>
                <td>${item.price}</td>
                <td>${item.stock}</td>                
                <td>${item.weight}</td>               
                <td>${item.description}</td>
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

            // Tambahkan event listener untuk tombol edit dan delete
            row.querySelector('.edit-button').addEventListener('click', function() {
                editProduct(item.id);
            });
            row.querySelector('.delete-button').addEventListener('click', function() {
                deleteProduct(item.id);
            });
        });

        updatePaginationButtons(data.length, page);
    }

    // Fungsi untuk memperbarui status tombol pagination
    function updatePaginationButtons(totalItems, currentPage) {
        const maxPage = Math.ceil(totalItems / rowsPerPage);

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === maxPage;
    }

    // Fungsi untuk memperbarui informasi jumlah data yang ditampilkan
    function updatePaginationInfo(totalItems) {
        const start = (currentPage - 1) * rowsPerPage + 1;
        const end = Math.min(currentPage * rowsPerPage, totalItems);
        showingInfo.textContent = `Showing ${start} to ${end} of ${totalItems} entries`;
    }

    // Fungsi untuk menambah produk baru
    const addRowButton = document.getElementById('addRowButton');
    addRowButton.addEventListener('click', async function() {
        const addCategory = document.getElementById('addCategory').value.trim();
        const addFoto = document.getElementById('addFoto').files[0];
        const addName = document.getElementById('addName').value.trim();
        const addPrice = document.getElementById('addPrice').value.trim();
        const addStock = document.getElementById('addStock').value.trim();
        const addWeight = document.getElementById('addWeight').value.trim();
        const addDeskripsi = document.getElementById('addDeskripsi').value.trim();

        if (!addCategory || !addFoto || !addName || !addPrice || !addStock || !addWeight || !addDeskripsi) {
            alert('Please fill in all fields.');
            return;
        }

        const formData = new FormData();
        formData.append('id_category', addCategory);
        formData.append('photos', addFoto);
        formData.append('name', addName);
        formData.append('price', addPrice);
        formData.append('stock', addStock);
        formData.append('weight', addWeight);
        formData.append('description', addDeskripsi);

        try {
            const response = await fetch('http://localhost:8081/putra-jaya-api/product/add', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Product added successfully!');
                fetchData(); // Refresh data produk setelah penambahan
            } else {
                alert('Failed to add product.');
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    });

    // Fungsi untuk mengedit produk
    async function editProduct(id) {
        try {
            // Fetch data produk berdasarkan ID
            const response = await fetch(`http://localhost:8081/api-putra-jaya/product/${id}`);
            const product = await response.json();

            // Isi form modal edit dengan data produk
            document.getElementById('EditInputIdCategory').value = product.data.id_category;
            document.getElementById('EditInputNameProduct').value = product.data.name;
            document.getElementById('EditInputPrice').value = product.data.price;
            document.getElementById('EditInputStock').value = product.data.stock;
            document.getElementById('EditInputWeight').value = product.data.weight;
            document.getElementById('EditInputDescription').value = product.data.description;

            // Simpan ID produk di form untuk submit
            const editProductForm = document.getElementById('editProductForm');
            editProductForm.dataset.productId = id;

            // Tampilkan modal edit
            const editProductModal = new bootstrap.Modal(document.getElementById('editProductModal'), {
                backdrop: 'static',
                keyboard: false
            });
            editProductModal.show();
        } catch (error) {
            console.error('Error fetching product data:', error);
        }
    }

    // Event listener untuk tombol Edit
    document.addEventListener('click', function(event) {
        if (event.target.closest('.edit-button')) {
            const productId = event.target.closest('.edit-button').getAttribute('data-product-id');
            editProduct(productId); // Panggil fungsi editProduct dengan ID produk
        }
    });

    // Fungsi untuk menyimpan perubahan produk setelah diedit
    document.getElementById('saveEditButton').addEventListener('click', async function() {
        const editProductForm = document.getElementById('editProductForm');
        const productId = editProductForm.dataset.productId;

        const updatedProduct = {
            id_category: document.getElementById('EditInputIdCategory').value,
            name: document.getElementById('EditInputNameProduct').value,
            price: document.getElementById('EditInputPrice').value,
            stock: document.getElementById('EditInputStock').value,
            weight: document.getElementById('EditInputWeight').value,
            description: document.getElementById('EditInputDescription').value
        };

        try {
            const response = await fetch(`http://localhost:8081/api-putra-jaya/product/update/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProduct)
            });

            if (response.ok) {
                alert('Product updated successfully!');
                fetchData(); // Refresh data produk setelah update
                const editProductModal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
                editProductModal.hide(); // Tutup modal setelah berhasil
            } else {
                alert('Failed to update product.');
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    });

    // Event listener untuk button delete
document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('delete-button')) {
        const productId = event.target.getAttribute('data-product-id');
        showDeleteConfirmation(productId);
    }
});

// Fungsi untuk menampilkan konfirmasi penghapusan
function showDeleteConfirmation(productId) {
    swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!"
    }).then((result) => {
        if (result.value) {
            deleteProduct(productId);
        }
    });
}

// Fungsi untuk menghapus produk
function deleteProduct(productId) {
    fetch(`http://localhost:8081/api-putra-jaya/product/delete/${productId}`, {
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
        swal(
            'Deleted!',
            'Your product has been deleted.',
            'success'
        ).then(() => {
            // Refresh data produk setelah berhasil menghapus
            fetchData();
        });
    })
    .catch(error => {
        swal(
            'Error!',
            'Failed to delete product.',
            'error'
        );
        console.error('Error deleting product:', error);
    });
}



});
