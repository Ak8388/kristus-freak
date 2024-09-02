document.addEventListener('DOMContentLoaded', function(){

const fetchDataBtn = document.getElementById('fetchPortfolio');
const addPortfolio = document.getElementById('addPortfolio');
const urlParams = new URLSearchParams(window.location.search);
const portfolioId = urlParams.get('id');
const addPortfolioForm = document.getElementById('addPortfolioForm');
const editPortfolioForm = document.getElementById('editPortfolioForm');
const showDataBtn = document.getElementById('showDataBtn');

document.querySelectorAll('.edit-button').forEach(button => {
    button.addEventListener('click', function(){
        const portfolioId = this.getAttribute('data-portfolio-id');
        editPortfolioForm(portfolioId);
    });
});

if(portfolioId){
    fetchPortfolioData(portfolioId)
}

if(showDataBtn) {
    showDataBtn.addEventListener('click', function(){
        fetchData();
        if(addPortfolio){
            addPortfolio.style.display = 'inline'
        }
    });
}

if(addPortfolio){
    addPortfolio.addEventListener('click', function(){
        const addPortfolioModal = new boostrap.Modal(document.getElementById('addPortfolioModal'),{
            backrop :'static',
            keyboard :false
        });
        addPortfolioModal.show();
    });
}

if(addPortfolioForm){
    addPortfolioForm.addEventListener('submit', async function(event){
        event.preventDefault();

        const name = document.getElementById('InputaName').value;
        const description = document.getElementById('InputDescription').value;
        const image = document.getElementById('InputImage').value;
        const date = document.getElementById('InputDate').value;

        try {
            const response  = await fetch('http://localhost:8081/api-putra-jaya/portfolio/add',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    project_name:name,
                    project_description:description,
                    project_image:image,
                    project_date:date
                })
            });

            if (!response.ok){
                throw new Error(`HTTP error! Status : ${response.status}`);
            }

            const result = await response.json();
            console.log('Service added successfully:', result);
            alert('Service added successfully');
            addPortfolioForm.reset();

            const addPortfolioModal = boostrap.Modal.getInstance(document.getElementById('addPortfolioModal'));
            addPortfolioModal.hide();
            fetchData();

        } catch (error) {
            console.error('Error adding portfolio', error);
            alert('Failed to add portfolio');
        }
    });
}

if(editPortfolioForm){
    editPortfolioForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const id = editPortfolioForm.dataset.portfolioId;
        const name = document.getElementById('editName').value;
        const description = document.getElementById('editDescription').value;
        const image = document.getElementById('editImage').value;
        const date = document.getElementById('editDate').value;

        try {
            const response = await fetch(`http://localhost:8081/api-putra-jaya/portfolio/update/${id}`,{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    project_name:name,
                    project_description:description,
                    project_image:image,
                    project_date:date
                })
            });

            if(!response.ok){
                throw new Error(`HTTP error! Status: ${response.status}`);
                
            }

            const result = await response.json();
            console.log('Service edited successfully:', result);
            alert('Service edited successfully');
            editPortfolioForm.reset();
            const editPortfolioModal = boostrap.Modal.getInstance(document.getElementById('editPortfolioModal'));
            editPortfolioModal.hide();
            fetchData();

        } catch (error) {
            console.error('Error editing portfolio:', error);
            alert('Failed to edit portfolio');
        }
    });
    }
});

async function fetchData(){
    try {
        const response = await fetch('http://localhost:8081/api-putra-jaya/portfolio/list');
        const data = await response.json();
        console.log(data);
        const table = document.getElementById('table-portfolio');
        const tableHead = document.createElement('thead');
        tableHead.innerHTML = `
            <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Image</th>
            <th>Date</th>
            <th>Aksi</th>
            </tr>
        `;
        table.innerHTML = '';
        table.appendChild(tableHead);
        const tableBody = document.createElement('tbody');
        const items = data.data || [];

        if(Array.isArray(items)) {
            items.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.project_name}</td>
                    <td>${item.project_description}</td>
                    <td>${item.project_image}</td>
                    <td>${item.project_date}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editPortfolio (${item.id})">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deletePortfolio(${item.id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }else {
            console.error('Items is not an array:', items);
        }
        table.appendChild(tableBody);
    } catch (error) {
        console.error('Error fetching data :', error);
    }
}

window.editPortfolio = async function(id){
    console.log(id);
    try {
        const response = await fetch(`http://localhost:8081/api-putra-jaya/portfolio/${id}`);
        const result = await response.json();
        console.log(result);

        document.getElementById('editName').value = result.project_name;
        document.getElementById('editDescription').value = result.project_description;
        document.getElementById('editImage').value = result.project_image;
        document.getElementById('editDate').value = result.project_date;
        editPortfolioForm.dataset.portfolioId = id;

        const  editPortfolioModal = new bootstrap.Modal(document.getElementById('editPortfolioModal'), {
            backdrop :'static',
            keyboard :false
        });
        editPortfolioModal.show();
    } catch (error) {
        console.error('Error fetching service data:', error);
        console.log(id);
        
    }
};

function deletePortfolio(id){
    console.log(id);
    if(confirm ('Are you sure want to delete this service ? ')){
        fetch(`http://localhost:8081/api-putra-jaya/delete/${id}`,{
            method :'POST',
            headers:{
                'Content-Type':'application/json'
            }
        })
        .then(response => {
            if(!response.ok){
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
            alert('Failed to delete portfolio');
        });
    }
}

async function fetchPortfolioData(id){
    try {
        const response = await fetch(`http://localhost:8081/api-putra-jaya/portfolio/${id}`);

        if (!response.ok){
            throw new Error (`HTTP error! Status:${response.status}`);

        }
        const data = await response.json();

        document.getElementById('editName').value = data.project_name;
        document.getElementById('editDescription').value = data.project_description;
        document.getElementById('editImage').value = data.project_image;
        document.getElementById('editDate').value = data.project_date;
        const editForm = document.getElementById('editPortfolioForm');
        editForm.setAttribute('portfolio-id', id);
    } catch (error) {
        console.error('Error fetching service data:', error);
    }
}

