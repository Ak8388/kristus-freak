document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const fullName = document.getElementById('inputFirstName').value;
        const email = document.getElementById('inputEmail').value;
        const password = document.getElementById('inputPassword').value;
        const confirmPassword = document.getElementById('inputPasswordConfirm').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        const data = {
            name: fullName,
            email: email,
            password: password,
            role: 'CUSTOMER'
        };

        try {
            const response = await fetch('http://localhost:8081/api-putra-jaya/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                alert('Registration successful! Please log in.');
                window.location.href = 'login.html';
            } else {
                alert(`Registration failed: ${result.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Registration failed. Please try again later.');
        }
    });
});
