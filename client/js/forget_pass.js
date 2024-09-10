async function sendResetLink() {
    const email = document.getElementById('email').value;
    const message = document.getElementById('message');

    if (validateEmail(email)) {
        message.style.color = '#28a745';
        message.textContent = 'Verification code sent! Please check your email.';
        // Here you would typically make an AJAX request to your server to send the reset email.
        try {
            const data = { 'email': email, 'status': 'forget' }
            await fetch('http://localhost:8081/api-putra-jaya/auth/email-verify', {
                method: "POST",
                body: JSON.stringify(data)
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('error');
                    } else {
                        return res.json();
                    }
                })
                .then(resData => {
                    localStorage.setItem('status','forget');
                    localStorage.setItem('verif-code', resData.code);
                    localStorage.setItem('em',email);
                    location.href = '../html/email_verify.html';
                })
        } catch (error) {
            console.error('Error:', error);
            alert('Registration failed. Please try again later.');
        }
    } else {
        message.style.color = '#d9534f';
        message.textContent = 'Please enter a valid email address.';
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

async function setNewPassword() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const message = document.getElementById('message');

    if (newPassword === confirmPassword) {
        if (validatePassword(newPassword)) {
            const email = localStorage.getItem('em');
            const data = {'email':email,'newPassword':newPassword}
            try {
                await fetch('http://localhost:8081/api-putra-jaya/auth/forget-password', {
                    method: "PUT",
                    body: JSON.stringify(data)
                })
                
                .then(res => {
                    if (!res.ok) {
                        throw new Error('error');
                    } else {
                        return res.json();
                    }
                })
                .then(resData => {
                        message.style.color = '#28a745';
                        message.textContent = 'Password successfully set!';
                        location.href = '../login.html';
                    })
            } catch (error) {
                console.error('Error:', error);
                alert('Change password failed. Please try again later.');
            }
        } else {
            message.style.color = '#d9534f';
            message.textContent = 'Password must be at least 8 characters long.';
        }
    } else {
        message.style.color = '#d9534f';
        message.textContent = 'Passwords do not match. Please try again.';
    }
}

function validatePassword(password) {
    return password.length >= 9;
}