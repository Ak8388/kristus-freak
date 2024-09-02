document.getElementById('custom-order-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const materialElement = document.getElementById('material');
    const sizesElement = document.getElementById('sizes');
    const photosInputElement = document.getElementById('photos');
    const qtyElement = document.getElementById('qty');
    const notesElement = document.getElementById('notes');
    const estimateWorkmanshipElement = document.getElementById('estimateWorkmanship');
    const addressShippingElement = document.getElementById('addressShipping');

    if (!materialElement || !sizesElement || !photosInputElement || !qtyElement || !notesElement || !estimateWorkmanshipElement || !addressShippingElement) {
        console.error('One or more form elements are missing');
        return;
    }

    const material = materialElement.value;
    const sizes = sizesElement.value;
    const photos = photosInputElement.files.length > 0 ? photosInputElement.files[0].name : '';
    const qty = qtyElement.value;
    const notes = notesElement.value;
    const estimateWorkmanship = estimateWorkmanshipElement.value;
    const addressShipping = addressShippingElement.value;

    fetch('http://localhost:8081/api-putra-jaya/custom-order/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            category_name:1, // Default value
            material: material,
            sizes: sizes,
            photos: photos,
            qty: parseInt(qty, 10),
            note: notes,
            id_status: 1, // Default value
            estimate_workmanship: parseInt(estimateWorkmanship, 10),
            address_shipping: addressShipping
        })
    })
    .then(response => {
        if (response.ok) { // Check if the response status is 200-299
            return response.json();
        } else {
            throw new Error('Failed to send order');
        }
    })
    .then(data => {
        console.log('Response from server:', data); // Log full response for debugging
        alert('Order sent successfully!');
        document.getElementById('custom-order-form').reset();
        window.location.href='index.html'; // Reset the form after successful submission
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to send order. Please try again.');
    });
});


const serviceApiUrl = 'http://localhost:8081/api-putra-jaya/service/list';
async function fetchAndPopulateServices() {
    try {
        const response = await fetch(serviceApiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const services = data.data || [];
        const dropdown = document.getElementById('servicesDropdown');
        dropdown.innerHTML = '<option value="" selected disabled>Select Service</option>'; // Clear existing options

        services.forEach(service => {
            const option = document.createElement('option');
            option.value = service.id; // Assuming 'id' is the identifier for the service
            option.textContent = service.service_name; // Assuming 'service_name' is the name of the service
            dropdown.appendChild(option);
        });

    } catch (error) {
        console.error('Fetch error:', error);
        const dropdown = document.getElementById('servicesDropdown');
        dropdown.innerHTML = '<option>Error loading services</option>';
    }
}

fetchAndPopulateServices();


// bahan 

const materials = {
    rebar: {
        sizes: ['6 mm', '8 mm', '10 mm', '12 mm', '16 mm', '19 mm', '22 mm', '25 mm'],
        details: ['12 meter per batang']
    },
    plat: {
        sizes: ['1.2 mm', '1.5 mm', '2 mm', '3 mm', '4 mm', '6 mm', '8 mm', '10 mm'],
        details: ['4 feet x 8 feet (1.2 m x 2.4 m)']
    },
    hollow: {
        sizes: ['15x15 mm', '20x20 mm', '30x30 mm', '40x40 mm', '50x50 mm', '60x60 mm'],
        details: ['1.2 mm', '1.5 mm', '2 mm']
    },
    unp: {
        sizes: ['50 mm', '65 mm', '80 mm', '100 mm', '120 mm', '150 mm'],
        details: ['6 meter per batang']
    },
    wf: {
        sizes: ['150x75 mm', '200x100 mm', '250x125 mm', '300x150 mm'],
        details: ['6 meter', '12 meter per batang']
    },
    siku: {
        sizes: ['20x20 mm', '30x30 mm', '40x40 mm', '50x50 mm', '60x60 mm', '70x70 mm'],
        details: ['3 mm', '4 mm', '5 mm']
    },
    pipa: {
        sizes: ['1/2 inch', '3/4 inch', '1 inch', '1.5 inch', '2 inch'],
        details: ['1.2 mm', '1.5 mm', '2 mm', '3 mm']
    },
    aluminium: {
        sizes: ['1 mm', '1.5 mm', '2 mm', '3 mm'],
        details: ['4 feet x 8 feet (1.2 m x 2.4 m)']
    },
    stainless: {
        sizes: ['1 mm', '1.5 mm', '2 mm', '3 mm'],
        details: ['4 feet x 8 feet (1.2 m x 2.4 m)']
    },
    galvanis: {
        sizes: ['0.3 mm', '0.5 mm', '0.8 mm', '1 mm'],
        details: ['4 feet x 8 feet (1.2 m x 2.4 m)']
    },
    kuningan: {
        sizes: ['1 mm', '2 mm', '3 mm'],
        details: ['4 feet x 8 feet (1.2 m x 2.4 m)']
    },
    tembaga: {
        sizes: ['0.5 mm', '1 mm', '1.5 mm', '2 mm'],
        details: ['4 feet x 8 feet (1.2 m x 2.4 m)']
    }
};

const materialDropdown = document.getElementById('materialDropdown');
const sizeDropdown = document.getElementById('sizeDropdown');
const detailsDropdown = document.getElementById('detailsDropdown');
const sizeContainer = document.getElementById('sizeContainer');
const detailsContainer = document.getElementById('detailsContainer');

materialDropdown.addEventListener('change', function () {
    const material = this.value;
    if (material && materials[material]) {
        // Populate size dropdown
        const sizes = materials[material].sizes;
        sizeDropdown.innerHTML = '<option value="" selected disabled>Select Size</option>';
        sizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            sizeDropdown.appendChild(option);
        });
        sizeDropdown.disabled = false;
        sizeContainer.style.display = 'block';
        
        // Clear and disable details dropdown
        detailsDropdown.innerHTML = '<option value="" selected disabled>Select Details</option>';
        detailsDropdown.disabled = true;
        detailsContainer.style.display = 'none';
    } else {
        sizeDropdown.disabled = true;
        sizeContainer.style.display = 'none';
        detailsDropdown.disabled = true;
        detailsContainer.style.display = 'none';
    }
});

sizeDropdown.addEventListener('change', function () {
    const material = materialDropdown.value;
    const size = this.value;
    if (material && size && materials[material]) {
        // Populate details dropdown
        const details = materials[material].details;
        detailsDropdown.innerHTML = '<option value="" selected disabled>Select Details</option>';
        details.forEach(detail => {
            const option = document.createElement('option');
            option.value = detail;
            option.textContent = detail;
            detailsDropdown.appendChild(option);
        });
        detailsDropdown.disabled = false;
        detailsContainer.style.display = 'block';
    } else {
        detailsDropdown.disabled = true;
        detailsContainer.style.display = 'none';
    }
});
