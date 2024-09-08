document.addEventListener('DOMContentLoaded', function(){

    fetchData();
});

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
                    <td>${item.status}</td>
                    <td>
                    <div class="form-button-action">
                            <button type="button" class="btn btn-link btn-primary btn-lg edit-button" onclick="editProduct(${item.id})" title="Edit Task">
                            <i class="fa fa-edit"></i>
                            </button>
                            <button type="button" class="btn btn-link btn-danger delete-button" onclick="showDeleteConfirmation(${item.id})" title="Remove">
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