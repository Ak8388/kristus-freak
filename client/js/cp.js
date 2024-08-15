document.addEventListener('DOMContentLoaded', function() {
    const addCompany = document.getElementById('addCompany');
    const showDataBtn = document.getElementById('showDataBtn');
    const addCompanyForm = document.getElementById('addCompanyForm');
    // const urlParams = new URLSearchParams(window.location.search);
    // const companyId = urlParams.get('id');
    const editCompanyForm = document.getElementById('editCompanyForm');
    // const h1Element = document.getElementById('companyName');

    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function(){
            const companyId = this.getAttribute('data-company-id');
            // editCompanyForm(companyId);
            fetchCompanyData(companyId);
        });
    });

    // if (companyId) {
    //     fetchCompanyData(companyId);
    // }
    
    if (showDataBtn) {
        showDataBtn.addEventListener('click', function() {
            fetchData();
            if(addCompany) {
                addCompany.style.display = 'inline'
            }
        });
    }

    if(addCompany){
        addCompany.addEventListener('click', function(){
            const addCompanyModal = new bootstrap.Modal(document.getElementById('addCompanyModal'),{
                backdrop:'static',
                keyboard:false
            });
            addCompanyModal.show();
        });
    }

    if (addCompanyForm){
        addCompanyForm.addEventListener('submit', async function(event){
            event.preventDefault();

            const name = document.getElementById('InputName').value;
            const description = document.getElementById('InputDescription').value;
            const phone = document.getElementById('InputPhone').value;
            const email = document.getElementById('InputEmail').value;
            const logo = document.getElementById('InputLogo').value;
            const visi = document.getElementById('InputVision').value;
            const misi = document.getElementById('InputMision').value;

            const token = localStorage.getItem('token');
            console.log(token);

            if (!token) {
                alert('akses dibatasi');
                return;
            }

            try {
                const response = await fetch('http://localhost:8081/api-putra-jaya/company-profile/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        
                        name:name,
                        description:description,
                        email:email,
                        phone:phone,
                        logo:logo,
                        visi:visi,
                        misi:misi
                    })
                });
                if (!response.ok){
                    throw new Error (`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                console.log('Product added successfully:', result);
                alert('Product added successfully!');
                addCompanyForm.reset();
                const addCompanyModal = bootstrap.Modal.getInstance(document.getElementById('addCompanyModal'));
                addCompanyModal.hide();
                fetchData();
            } catch (error) {
                console.error('Error adding product:', error);
                alert('Failed to add product.');
            }
        });
    }

    if (editCompanyForm) {
         editCompanyForm.addEventListener('submit', async function(event){
            event.preventDefault();
            const id = editCompanyForm.dataset.companyId;
            const name = document.getElementById('EditInputName').value;
            const description = document.getElementById('EditInputDescription').value;
            const address = document.getElementById('EditInputAddress').value;
            const phone = document.getElementById('EditInputPhone').value;
            const email = document.getElementById('EditInputEmail').value;
            const logo = document.getElementById('EditInputLogo').value;
            const visi = document.getElementById('EditInputVision').value;
            const misi = document.getElementById('EditInputMision').value;
         try {
            const response = await fetch(`http://localhost:8081/api-putra-jaya/company/update/${id}`, {
                method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                body:JSON.stringify({
                    name:name,
                    description:description,
                    address:address,
                    email:email,
                    phone:phone,
                    logo_url:logo,
                    vision:visi,
                    mission:misi
                })
            });

            // if (response.status === 200) {
            //     // Tindakan yang dilakukan jika response sukses
            //     console.log('Produk berhasil diedit');
            // } else {
            //     throw new Error(`HTTP error! Status: ${response.status}`);
            // }
            
            const result = await response.json();
            console.log('Product edited successfully:', result);
            alert('Product edited successfully!');
            editCompanyForm.reset();
            const editCompanyModal = bootstrap.Modal.getInstance(document.getElementById('editCompanyModal'));
            editCompanyModal.hide();
            fetchData();

         } catch (error) {
            console.error('Error editing product:', error);
                alert('Failed to edit product.');
            
         }
         });
    }

});

    document.getElementById('EditInputLogo').addEventListener('change', function(event) {
        const file = event.target.files[0];
        const preview = document.getElementById('previewLogo');

        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.style.display = 'block'; // Tampilkan gambar
            };
            reader.readAsDataURL(file);
        } else {
            preview.style.display = 'none'; // Sembunyikan gambar jika tidak ada file yang dipilih
        }
    });

async function fetchData() {
    try {
        const response = await fetch('http://localhost:8081/api-putra-jaya/company/'); // URL endpoint
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log(data);
        const table = document.getElementById('table-company');
         // Kosongkan tabel sebelumnya

        const tableHead = document.createElement('thead');
        tableHead.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Address</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Logo</th>
                <th>Visi</th>
                <th>Misi</th>
                <th>Actions</th>
                
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
                    <td>${item.name}</td>
                    <td>${item.description}</td>
                    <td>${item.address}</td>
                    <td>${item.email}</td>
                    <td>${item.phone}</td>
                    <td><img src="${item.logo_url}" alt="Logo" style="width: 100px; height: auto;"></td>
                    <td>${item.vision}</td>
                    <td>${item.mission}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editCompany(${item.id})">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteData(${item.id})">Delete</button>
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




window.editCompany = async function(id) {
    try {
        const response = await fetch(`http://localhost:8081/api-putra-jaya/company/${id}`);
        const cp = await response.json();
        document.getElementById('EditInputName').value = cp.name;
        document.getElementById('EditInputDescription').value = cp.description;
        document.getElementById('EditInputAddress').value = cp.address;
        document.getElementById('EditInputEmail').value = cp.email;
        document.getElementById('EditInputPhone').value = cp.phone;
        // document.getElementById('EditInputLogo').value = cp.logo_url;
        document.getElementById('EditInputVision').value = cp.vision;
        document.getElementById('EditInputMision').value = cp.mision;

        editCompanyForm.dataset.companyId = id;

        // console.log('Initializing and showing modal...');
        const editCompanyModal = new bootstrap.Modal(document.getElementById('editCompanyModal'), {
            backdrop: 'static',
            keyboard: false
        });
        editCompanyModal.show();
    } catch (error) {
        console.log('CEKK !');
        console.error('Error fetching product data:', error);
    }
};

async function fetchCompanyData(id) {
    try {
        const response = await fetch(`http://localhost:8081/api-putra-jaya/company/${id}`);

        const data = await response.json();

         document.getElementById('editInputName').value = data.name;
         document.getElementById('editInputDescription').value= data.description;
         document.getElementById('editInputAddress').value= data.address;
         document.getElementById('editInputEmail').value = data.email;
         document.getElementById('editInputPhone').value = data.phone;
         document.getElementById('editInputLogo').value = data.logo_url;
         document.getElementById('editInputVision').value = data.vision;
         document.getElementById('editInputMision').value = data.mision;

        const editCompanyForm = document.getElementById('editCompanyForm');
        editCompanyForm.setAttribute('data-company-id', id);

    } catch (error) {
        console.error('Error fetching data company profile :', error);
    }
}