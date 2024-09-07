function displayPortfolio(portfolios) {
    if (!Array.isArray(portfolios)) {
        console.error('Expected an array but got:', portfolios);
        return;
    }

    const portfolioList = document.querySelector('.portfolio-list');
    portfolioList.innerHTML = ''; // Clear existing content

    portfolios.forEach(portfolio => {
        // Create a new column for each portfolio item
        const portfolioItem = document.createElement('div');
        portfolioItem.classList.add('col-12', 'col-md-4', 'col-lg-3', 'mb-5', 'mb-md-0');

        const link = document.createElement('a');
        link.classList.add('product-item');
        link.href = '#';

        // Create and set the image
        const img = document.createElement('img');
        img.src = "../server/" + portfolio.project_image;
        img.classList.add('img-fluid', 'product-thumbnail');

        // Create and set the project title
        const title = document.createElement('h3');
        title.textContent = portfolio.project_name;
        title.classList.add('product-title');

        // Create and set the project date
        const date = document.createElement('h4');
        date.textContent = new Date(portfolio.project_date).toLocaleDateString('id-ID');
        date.classList.add('product-date');

        // Create and set the project description
        const description = document.createElement('p');
        description.textContent = portfolio.project_description;
        description.classList.add('product-description');

        // Create and set the cross icon
        const iconCross = document.createElement('span');
        iconCross.classList.add('icon-cross');
        const crossImage = document.createElement('img');
        crossImage.src = 'images/cross.svg';
        crossImage.classList.add('img-fluid');
        iconCross.appendChild(crossImage);

        // Append everything to the link
        link.appendChild(img);
        link.appendChild(title);
        link.appendChild(date);
        link.appendChild(description);
        link.appendChild(iconCross);

        // Append the link to the column
        portfolioItem.appendChild(link);

        // Append the column to the portfolio list
        portfolioList.appendChild(portfolioItem);
    });
}

// Fetch data from API and display it
fetch('http://localhost:8081/api-putra-jaya/portfolio/list')
    .then(response => response.json())
    .then(responseData => displayPortfolio(responseData.data))  // Access the data array
    .catch(error => console.error('Error fetching data:', error));