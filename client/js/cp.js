document.addEventListener('DOMContentLoaded', function() {
    const editCompanyForm = document.getElementById('editCPForm');
    
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function(){
            const companyId = this.getAttribute('data-company-id');
            fetchCompanyData(companyId);
        });
    });

    if (editCompanyForm) {
        editCompanyForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const id = editCompanyForm.dataset.companyId;
            const name = document.getElementById('EditInputName').value;
            const address = document.getElementById('EditInputAlamat').value;
            const email = document.getElementById('EditInputEmail').value;
            const phone = document.getElementById('EditInputTelp').value;
            const logo = document.getElementById('EditInputLogo').value;
            const visi = document.getElementById('EditInputVisi').value;
            const misi = document.getElementById('EditInputMisi').value;

            try {
                const response = await fetch(`http://localhost:8081/api-putra-jaya/company/update/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        address: address,
                        email: email,
                        phone: phone,
                        logo_url: logo,
                        vision: visi,
                        mission: misi
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                console.log('Company profile edited successfully:', result);
                alert('Company profile edited successfully!');
                editCompanyForm.reset();
                const editCompanyModal = bootstrap.Modal.getInstance(document.getElementById('editCPModal'));
                editCompanyModal.hide();
                fetchData();

            } catch (error) {
                console.error('Error editing company profile:', error);
                alert('Failed to edit company profile.');
            }
        });
    }
});

async function fetchData() {
    try {
        const response = await fetch('http://localhost:8081/api-putra-jaya/company/');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        const table = document.getElementById('table-company');
        table.innerHTML = ''; // Kosongkan tabel sebelumnya

        const tableHead = document.createElement('thead');
        tableHead.innerHTML = `
            <tr>
                <th>Nama</th>
                <th>Alamat</th>
                <th>Email</th>
                <th>No. Telp</th>
                <th>Logo</th>
                <th>Visi</th>
                <th>Misi</th>
                <th>Aksi</th>
            </tr>
        `;
        table.appendChild(tableHead);

        const tableBody = document.createElement('tbody');
        const items = data.data || [];

        if (Array.isArray(items)) {
            items.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.address}</td>
                    <td>${item.email}</td>
                    <td>${item.phone}</td>
                    <td><img src="${item.logo_url}" alt="Logo" style="width: 100px; height: auto;"></td>
                    <td>${item.vision}</td>
                    <td>${item.mission}</td>
                    <td>
                        <button class="btn btn-warning btn-sm edit-button" data-company-id="${item.id}">Edit</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        }

        table.appendChild(tableBody);

        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', function() {
                const companyId = this.getAttribute('data-company-id');
                fetchCompanyData(companyId);
            });
        });

    } catch (error) {
        console.error('Error fetching company profiles:', error);
    }
}

async function fetchCompanyData(id) {
    try {
        const response = await fetch(`http://localhost:8081/api-putra-jaya/company/${id}`);
        const data = await response.json();

        document.getElementById('EditInputName').value = data.name;
        document.getElementById('EditInputAlamat').value = data.address;
        document.getElementById('EditInputEmail').value = data.email;
        document.getElementById('EditInputTelp').value = data.phone;
        document.getElementById('EditInputVisi').value = data.vision;
        document.getElementById('EditInputMisi').value = data.mission;

        editCompanyForm.setAttribute('data-company-id', id);

        const editCompanyModal = new bootstrap.Modal(document.getElementById('editCPModal'), {
            backdrop: 'static',
            keyboard: false
        });
        editCompanyModal.show();
    } catch (error) {
        console.error('Error fetching company profile data:', error);
    }
}
