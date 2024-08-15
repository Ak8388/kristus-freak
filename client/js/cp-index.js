
    // Endpoint API
    const apiUrl = 'http://localhost:8081/api-putra-jaya/company/';

    // Fungsi untuk mengambil data dari endpoint dan memperbarui elemen h1
    async function fetchAndUpdateCompanyName() {
        try {
            // Mengambil data dari endpoint
            const response = await fetch(apiUrl);
            
            // Mengecek apakah permintaan berhasil
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Mengurai respons JSON
            const data = await response.json();
            const items = data.data || [];

            // Mengambil elemen h1
            const h1Element = document.getElementById('companyName');
            const description = document.getElementById('description');
            
            // Memperbarui teks elemen h1 dengan data dari API
            if (Array.isArray(items) && items.length > 0) {
                h1Element.textContent = items[0].name || 'No Name Available';
                description.textContent = items[0].description ||'No Descrition Available';
            } else {
                h1Element.textContent = 'No Name Available';
            }        } catch (error) {
            console.error('Fetch error:', error);
            // Menampilkan pesan kesalahan pada elemen h1 jika ada kesalahan
            document.getElementById('companyName').textContent = 'Error fetching data';
        }
    }

    // Panggil fungsi saat halaman dimuat
    fetchAndUpdateCompanyName();

    const serviceApiUrl = 'http://localhost:8081/api-putra-jaya/service/list';

// Fungsi untuk fetch data service dan menambahkannya ke dropdown
async function fetchAndUpdateServices() {
    try {
        // Ambil data dari endpoint
        const response = await fetch(serviceApiUrl);

        // Cek apakah request berhasil
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse response ke JSON
        const data = await response.json();
        const services = data.data || [];

        // Ambil elemen dropdown menu
        const dropdownMenu = document.getElementById('servicesDropdownMenu');

        // Hapus konten sebelumnya di dropdown menu (jika ada)
        dropdownMenu.innerHTML = '';

        // Loop melalui data services dan buat elemen <a> untuk setiap service
        services.forEach(service => {
            const serviceLink = document.createElement('a');
            serviceLink.className = 'dropdown-item';
            serviceLink.href = `#${service.service_name.toLowerCase().replace(/\s+/g, '-')}`;
            serviceLink.textContent = service.service_name;
            dropdownMenu.appendChild(serviceLink);
        });

    } catch (error) {
        console.error('Fetch error:', error);
        // Menampilkan pesan error jika fetch gagal
        document.getElementById('servicesDropdownMenu').innerHTML = '<p>Error loading services</p>';
    }
}

// Panggil fungsi fetch saat halaman dimuat
fetchAndUpdateServices();

// Event listener untuk dropdown
document.querySelector('.nav-link.dropdown-toggle').addEventListener('click', function (e) {
    e.preventDefault();
    const dropdownMenu = this.nextElementSibling;
    dropdownMenu.classList.toggle('show');
});

document.addEventListener('click', function (e) {
    if (!e.target.matches('.nav-link.dropdown-toggle')) {
        const dropdowns = document.querySelectorAll('.dropdown-menu.show');
        dropdowns.forEach(function (dropdown) {
            dropdown.classList.remove('show');
        });
    }
});

    const message = "Halo, apakah saya bisa membooking jasa las di bengkel Putra Jaya Las Listrik ?";
    const encodedMessage = encodeURIComponent(message);
    console.log(encodedMessage);