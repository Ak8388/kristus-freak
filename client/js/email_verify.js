async function verifyCode() {
    const verificationCode = document.getElementById('verificationCode').value;
    const message = document.getElementById('message');
    const stts = localStorage.getItem('status');
    const correctCode = localStorage.getItem('verif-code');
    // Example hardcoded verification code

    if (verificationCode === correctCode) {
        message.style.color = '#28a745';
        message.textContent = 'Verification successful!';
        // Redirect or proceed to next step
        if (stts === "regist") {
            const data = localStorage.getItem('data');
            const data2 = JSON.parse(data);
            try {
                const response = await fetch('http://localhost:8081/api-putra-jaya/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data2)
                });
                const result = await response.json();

                if (response.ok) {
                    alert('Registration successful! Please log in.');
                    localStorage.removeItem('verif-code');
                    localStorage.removeItem('status');
                    localStorage.removeItem('data');
                    window.location.href = 'login.html';
                } else {
                    alert(`Registration failed: ${result.message}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Registration failed. Please try again later.');
            }
        } else {
            location.href='../html/enter_password.html'
        }
    } else {
        message.style.color = '#d9534f';
        message.textContent = 'Invalid verification code. Please try again.';
    }

}
