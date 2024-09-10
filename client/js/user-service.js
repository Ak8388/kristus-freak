async function fetchDataServiceUser() {
    try {
        const response = await fetch('http://localhost:8081/api-putra-jaya/service/list');
        const data = await response.json();
        console.log(data);
        
        // Menampilkan data pada console untuk debugging
        console.log(data);

        const items = data.data || [];
        const row = document.getElementById('service-row');
        row.innerHTML = ''; // Kosongkan kontainer sebelum mengisi data baru

        items.forEach(item => {
            // Membuat elemen feature untuk setiap item
            const feature = document.createElement('div');
            feature.classList.add('col-6', 'col-md-6', 'col-lg-3', 'mb-4');
            feature.innerHTML = `
                <div class="feature">
                    <div class="icon">
						<img src="images/truck.svg" alt="Image" class="imf-fluid">
                    </div>
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                </div>
            `;

            // Menambahkan elemen feature ke dalam row
            row.appendChild(feature);
        });

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Panggil fungsi untuk fetch data saat halaman dimuat
fetchDataServiceUser();