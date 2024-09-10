let currentBlogIndex = 0; // Index untuk detail blog
let blogItems = []; // Menyimpan data blog

// Ambil data blog dari API
async function fetchData() {
    try {
        const response = await fetch('http://localhost:8081/api-putra-jaya/blog/list');
        const data = await response.json();
        blogItems = data.data || [];

        if (blogItems.length > 0) {
            displayBlogList(); // Tampilkan daftar blog di side
            displayBlogDetail(currentBlogIndex); // Tampilkan detail blog pertama
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Tampilkan daftar blog di sidebar
function displayBlogList() {
    const blogList = document.getElementById('blog-list');
    blogList.innerHTML = ''; // Kosongkan list sebelumnya

    blogItems.forEach((item, index) => {
        const blogItem = document.createElement('div');
        blogItem.classList.add('blog-item');
        blogItem.innerHTML = `
            <img src="../server/${item.image_url}" alt="Image">
            <span class="blog-item-title">${item.title}</span>
        `;
        blogItem.addEventListener('click', () => {
            currentBlogIndex = index;
            displayBlogDetail(index); // Tampilkan detail blog ketika di klik
        });

        blogList.appendChild(blogItem);
    });
}

// Tampilkan detail blog di container
function displayBlogDetail(index) {
    const blogRow = document.getElementById('blog-row');
    blogRow.innerHTML = ''; // Kosongkan detail sebelumnya

    if (index >= 0 && index < blogItems.length) {
        const item = blogItems[index];
        const date = new Date(item.updated_at);
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
                            "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;

        const postEntry = `
            <div class="post-entry">
                <img src="../server/${item.image_url}" alt="Image" class="img-fluid" style="width: 100%; height: auto;">
                <div class="post-content-entry" >
                    <h3 class="title" style="font-size: 30px; padding-top: 10px;">${item.title}</h3>
                    <div class="meta">
                        <span class="author" style="display: block; padding-top: 10px;">Penulis : ${item.author}</span>
                        <span class="date" style="display: block; padding-top: 10px;">Terbit pada : ${formattedDate}</span>
                    </div>
                    <p class="content" style="padding-top: 10px;">${item.content}</p>
                </div>
            </div>
        `;
        blogRow.innerHTML = postEntry;
    }
}

// Panggil fetchData untuk pertama kali
fetchData();
