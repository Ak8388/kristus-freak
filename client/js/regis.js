document.addEventListener('DOMContentLoaded', () => {
    const butnReg = document.getElementById('sign-up');

    butnReg.addEventListener('click', async (event) => {
        event.preventDefault();

        const fullName = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPass').value;

        const data = {
            name: fullName,
            email: email,
            password: password,
            role: 'CUSTOMER'
        };

        localStorage.setItem("data", JSON.stringify(data));
        localStorage.setItem('status','regist');
        
        try {
            const data = { 'email': email, 'status': 'regist' }
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
                    localStorage.setItem('verif-code', resData.code);
                    location.href = './html/email_verify.html';
                })
        } catch (error) {
            console.error('Error:', error);
            alert('Registration failed. Please try again later.');
        }
    });
});
