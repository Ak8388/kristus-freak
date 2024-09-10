document.addEventListener('DOMContentLoaded', function() {
    const addCategoryForm = document.getElementById('addCategoryForm');
    const editCategoryForm = document.getElementById('editCategoryForm');

    // Ambil data kategori dan tampilkan di tabel
    fetchData();

    // Event listener untuk tambah kategori
    document.getElementById('addRowButton').addEventListener('click', async function(event) {
        event.preventDefault();
        const name = document.getElementById('addName').value;

        try {
            const response = await fetch('http://localhost:8081/api-putra-jaya/category/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: name })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Category added successfully:', result);
            alert('Category added successfully!');
            // Reset form setelah submit berhasil
            addCategoryForm.reset();
            // Tutup modal setelah submit berhasil
            const addCategoryModal = bootstrap.Modal.getInstance(document.getElementById('addRowModal'));
            addCategoryModal.hide();
            // Refresh data kategori
            fetchData();
        } catch (error) {
            console.error('Error adding category:', error);
            alert('Failed to add category.');
        }
    });

    // Event listener untuk edit kategori
    document.getElementById('saveEditButton').addEventListener('click', async function(event) {
        event.preventDefault();
        const id = editCategoryForm.dataset.categoryId;
        const name = document.getElementById('EditInputName').value;

        try {
            const response = await fetch(`http://localhost:8081/api-putra-jaya/category/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: name })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Category edited successfully:', result);
            alert('Category edited successfully!');
            // Reset form setelah submit berhasil
            editCategoryForm.reset();
            // Tutup modal setelah submit berhasil
            const editCategoryModal = bootstrap.Modal.getInstance(document.getElementById('editCategoryModal'));
            editCategoryModal.hide();
            // Refresh data kategori
            fetchData();
        } catch (error) {
            console.error('Error editing category:', error);
            alert('Failed to edit category.');
        }
    });

    // Fungsi untuk mengambil data kategori dan menampilkannya di tabel
    // async function fetchData() {
    //     try {
    //         const response = await fetch('http://localhost:8081/api-putra-jaya/category/list');
    //         const data = await response.json();
    //         const table = document.getElementById('table-category');
    //         table.innerHTML = ''; 
    //         // Kosongkan tabel sebelum memasukkan data baru

    //         const tableHead = document.createElement('thead');
    //         tableHead.innerHTML = `
    //             <tr>
    //                 <th>ID</th>
    //                 <th>Name</th>
    //                 <th>Aksi</th>
    //             </tr>
    //         `;
    //         table.appendChild(tableHead);

    //         const tableBody = document.createElement('tbody');
    //         const items = data.data || [];

    //         if (Array.isArray(items)) {
    //             items.forEach(item => {
    //                 const row = document.createElement('tr');
    //                 row.innerHTML = `
    //                     <td>${item.id}</td>
    //                     <td>${item.name}</td>
    //                     <td>
    //                         <button class="btn btn-warning btn-sm" onclick="editCategory(${item.id})">Edit</button>
    //                         <button class="btn btn-danger btn-sm" onclick="deleteCategory(${item.id})">Delete</button>
    //                     </td>
    //                 `;
    //                 tableBody.appendChild(row);
    //             });
    //         }

    //         table.appendChild(tableBody);

    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     }
    // }


    async function fetchData() {
        try {
            const response = await fetch('http://localhost:8081/api-putra-jaya/category/list');
            const data = await response.json();
            const items = data.data || [];
    
            // Jika elemen tabel ada, tampilkan tabel kategori
            const table = document.getElementById('table-category');
            if (table) {
                table.innerHTML = ''; // Kosongkan tabel sebelum memasukkan data baru
    
                const tableHead = document.createElement('thead');
                tableHead.innerHTML = `
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Aksi</th>
                    </tr>
                `;
                table.appendChild(tableHead);
    
                const tableBody = document.createElement('tbody');
                items.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.id}</td>
                        <td>${item.name}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editCategory(${item.id})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteCategory(${item.id})">Delete</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
                table.appendChild(tableBody);
            }
    
            // Jika elemen tombol kategori ada, tampilkan tombol di sidebar
            const categoryButtons = document.getElementById('category-buttons');
            if (categoryButtons) {
                categoryButtons.innerHTML = ''; // Kosongkan tombol sebelum memasukkan data baru
                items.forEach(item => {
                    const button = document.createElement('button');
                    button.innerHTML = `<a href="#">${item.name}</a>`;
                    // button.classList.add('btn', 'btn-category');
                    categoryButtons.appendChild(button);
                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    
    // Panggil fetchData saat halaman dimuat
    document.addEventListener('DOMContentLoaded', fetchData);
    
    // Fungsi untuk mengedit kategori
    window.editCategory = async function(id) {
        try {
            const response = await fetch(`http://localhost:8081/api-putra-jaya/category/${id}`);
            const category = await response.json();

            // Isi form edit dengan data kategori
            document.getElementById('EditInputName').value = category.name;
            editCategoryForm.dataset.categoryId = id;

            const editCategoryModal = new bootstrap.Modal(document.getElementById('editCategoryModal'));
            editCategoryModal.show();
        } catch (error) {
            console.error('Error fetching category data:', error);
        }
    };

    // Fungsi untuk menghapus kategori
    window.deleteCategory = function(id) {
        if (confirm('Are you sure you want to delete this category?')) {
            fetch(`http://localhost:8081/api-putra-jaya/category/delete/${id}`, {
                method: 'DELETE',
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
                console.log('Category deleted successfully:', result);
                alert('Category deleted successfully!');
                // Refresh data kategori setelah berhasil menghapus
                fetchData();
            })
            .catch(error => {
                console.error('Error deleting category:', error);
                alert('Failed to delete category.');
            });
        }
    };
});
