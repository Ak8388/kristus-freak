document.addEventListener('DOMContentLoaded', function(){
fetchData();
async function fetchData(){
    try {
        const response = await fetch('http://localhost:8081/api-putra-jaya/blog/list');
        const data = await response.json();
        
        console.log(data);

        const tableBody = document.getElementById('tbody');
        tableBody.innerHTML = '';
        const items = data.data || [];
        if (Array.isArray(items)){
            items.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.title}</td>
                    <td>${item.content}</td>
                    <td><img class="img-prod" src="../../server/${item.image_url}"></td>
                    <td>${item.author}</td>
                    <td>
                    <div class="form-button-action">
                                <button type="button" class="btn btn-link btn-danger delete-button" data-id="${item.id}" title="Remove" onclick="showDeleteConfirmation(${item.id})">
                                    <i class="fa fa-times"></i>
                                </button>
                    </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }else {
            console.error('Items is not an array :', items);
        }
    } catch (error) {
        console.error('Eror fetching data:', error);
        
    }
}

    const token = localStorage.getItem('token');

    if (!token) {
        console.error('Authorization token is missing.');
        alert('You are not authorized. Please log in.');
        return;
    }

    document.getElementById('addBlog').addEventListener('click', async function (event) {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const imageInput = document.getElementById('image_url');
        const content = quill.root.innerHTML;

        console.log('Title:', title);
        console.log('Author:', author);
        console.log('Content:', content);
        
        const formData = new FormData();
        if (imageInput.files.length > 0) {
            console.log('Image File:', imageInput.files[0]);
            formData.append('image_url', imageInput.files[0]);
        }
        
        const blogData = {
            title: title,
            content: content,
            author: author
        };

        formData.append('json', JSON.stringify(blogData));

        // Log FormData entries
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value); 
        }

        try {
            const response = await fetch('http://localhost:8081/api-putra-jaya/blog/add', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Success Publish Blog!', result);
            alert('Blog added successfully!');

            window.location.href = "data-blog.html";
        } catch (error) {
            console.error('Error publishing blog:', error);
            alert('Failed to add blog');
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
            // Memanggil fungsi delete setelah konfirmasi
            removeData(id);
        }
    });
}

 function removeData (id) {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8081/api-putra-jaya/blog/delete/${id}`, {
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