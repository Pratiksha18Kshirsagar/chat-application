const baseURL = 'http://localhost:4000';

const form = document.getElementById('login-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value; 
    try {
        const response = await axios.post(`${baseURL}/user/login`, {
            email,
            password
        });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('email', email);
        alert('Login successful!');
        console.log('Login successful:', response.data);
        window.location.href = '../chatUi/index.html';
    }   
    catch (error) {
        console.error('Error during login:', error.response ? error.response.data : error.message);
    }
});

