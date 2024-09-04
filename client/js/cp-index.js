    const apiUrl = 'http://localhost:8081/api-putra-jaya/company/';

    async function fetchAndUpdateCompanyName() {
        try {
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const items = data.data || [];

            const h1Element = document.getElementById('companyName');
            const description = document.getElementById('description');
            
            if (Array.isArray(items) && items.length > 0) {
                h1Element.textContent = items[0].name || 'No Name Available';
                description.textContent = items[0].description ||'No Descrition Available';
            } else {
                h1Element.textContent = 'No Name Available';
            }        } catch (error) {
            console.error('Fetch error:', error);
            document.getElementById('companyName').textContent = 'Error fetching data';
        }
    }

    fetchAndUpdateCompanyName();

const serviceApiUrl = 'http://localhost:8081/api-putra-jaya/service/list';
async function fetchAndUpdateServices() {
    try {
        const response = await fetch(serviceApiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const services = data.data || [];
        const dropdownMenu = document.getElementById('servicesDropdownMenu');
        dropdownMenu.innerHTML = '';
        services.forEach(service => {
            const serviceLink = document.createElement('a');
            serviceLink.className = 'dropdown-item';
            serviceLink.href = `#${service.name.toLowerCase().replace(/\s+/g, '-')}`;
            serviceLink.textContent = service.name;
            dropdownMenu.appendChild(serviceLink);
        });

    } catch (error) {
        console.error('Fetch error:', error);
        document.getElementById('servicesDropdownMenu').innerHTML = '<p>Error loading services</p>';
    }
}
fetchAndUpdateServices();


document.addEventListener("DOMContentLoaded", function () {
    // Fetch data from API
    fetch("http://localhost:8081/api-putra-jaya/portfolio/list")
        .then(response => response.json())
        .then(data => {
            // Assuming the API returns an array of projects, you can adjust based on your API response structure
            const project = data[0]; // Get the first project or whichever you want to display

            // Update modal content with the fetched data
            document.getElementById("projectName").textContent = data.project_name;
            document.getElementById("projectDate").textContent = new Date(data.project_date).toLocaleDateString();
            document.getElementById("projectDescription").textContent = data.project_description;
            document.getElementById("projectImage").src = data.project_image; // Make sure the image path is correct
            // document.getElementById("serviceId").textContent = data.service_id;
        })
        .catch(error => console.error("Error fetching data:", error));
});




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
// console.log(encodedMessage);