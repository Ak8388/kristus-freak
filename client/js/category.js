document.addEventListener('DOMContentLoaded', function() {
    const addCategoryForm = document.getElementById('addCategoryForm');
    const editCategoryForm = document.getElementById('editCategoryForm');
    
    fetchData();

    document.getElementById('addRowButton').addEventListener('click', async function(event) {
        const token = localStorage.getItem('token');
        event.preventDefault();
        const name = document.getElementById('addName').value;

        try {
            const response = await fetch('http://localhost:8081/api-putra-jaya/category/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,

                },
                body: JSON.stringify({ name: name })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Category added successfully:', result);
            alert('Category added successfully!');
            window.location.reload();
        } catch (error) {
            console.error('Error adding category:', error);
            alert('Failed to add category.');
        }
    });

    document.getElementById('saveEditButton').addEventListener('click', async function(event) {
        event.preventDefault();
        const token = localStorage.getItem('token');
        const id = editCategoryForm.dataset.categoryId;
        const name = document.getElementById('EditInputName').value;

        try {
            const response = await fetch(`http://localhost:8081/api-putra-jaya/category/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({ name: name })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            console.log('Category edited successfully:', result);
            alert('Category edited successfully!');
            fetchData();
        } catch (error) {
            console.error('Error editing category:', error);
            alert('Failed to edit category.');
        }
    });


    window.editCategory = async function(id) {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8081/api-putra-jaya/category/${id}`,{
                method:"GET",
                headers: {
                    'Authorization' : 'Bearer ' + token
                }
            });
            if(!response.ok){
                throw new Error(`HTTP error! Status: ${response.status}`);

            }
            const category = await response.json();

            document.getElementById('EditInputName').value = category.data.name || '';
            editCategoryForm.dataset.categoryId = id;

            const editCategoryModal = new bootstrap.Modal(document.getElementById('editCategoryModal'));
            editCategoryModal.show();
        } catch (error) {
            console.error('Error fetching category data:', error);
            alert('Failed to fetch !');
        }
    };
});

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
                        <button class="btn btn-danger btn-sm" onclick="showDeleteConfirmation(${item.id})">Delete</button>
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
                // button.classList.add('btn', 'btn-category');
                categoryButtons.innerHTML +=`
                    <button style="border: none; background-color: white;" onclick="category(${item.id})"><a href="#">${item.name}</a></button>
                `;
            });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


function showDeleteConfirmation(id) {
    swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",  
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
                closeModal: false 
            }
        },
        dangerMode: true,
    }).then((isConfirm) => {
        if (isConfirm) {
            deleteCategory(id);
        }
    });
}

function deleteCategory (id) {
    const token = localStorage.getItem('token');
        fetch(`http://localhost:8081/api-putra-jaya/category/delete/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + token
            }
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
    
};

document.getElementById('close-btn').addEventListener('click', function() {
    window.location.reload();
});

document.getElementById('btnCls').addEventListener('click', function() {
    window.location.reload();
});