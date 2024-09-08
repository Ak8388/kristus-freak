document.addEventListener('DOMContentLoaded', function() {
    fetchData();
});

async function fetchData() {
    try {
        const response = await fetch('http://localhost:8081/api-putra-jaya/blog/list');
        const data = await response.json();
        console.log(data);

        const blogList = document.getElementById('blog-list');
        blogList.innerHTML = '';
        const items = data.data || [];
        if (Array.isArray(items)) {
            items.forEach(item => {
                const postEntry = document.createElement('div');
                postEntry.classList.add('col-12', 'col-sm-6', 'col-md-4', 'mb-4', 'mb-md-0');
                postEntry.innerHTML = `
                    <div class="post-entry">
                        <a href="#" class="post-thumbnail"><img src="../../server/${item.image_url}" alt="${item.title}" class="img-fluid"></a>
                        <div class="post-content-entry">
                            <h3><a href="#">${item.title}</a></h3>
                            <div class="meta">
                                <span>by <a href="#">${item.author}</a></span> <span>on <a href="#">${item.date || 'Unknown Date'}</a></span>
                            </div>
                        </div>
                    </div>
                `;
                blogList.appendChild(postEntry);
            });
        } else {
            console.error('Items is not an array:', items);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
