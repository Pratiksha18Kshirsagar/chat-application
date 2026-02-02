const baseURL = 'http://localhost:4000';

const form  = document.getElementById('signup-form');
form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phoneno = document.getElementById('phoneno').value;
    const password = document.getElementById('password').value; 
    try{
        const res = await axios.post(`${baseURL}/user/signup`,{
            name,
            email,
            phoneno,
            password
        }); 
        if(res.data.status === 'success'){
            alert('Signup successful');
            window.location.href = '/login.html';
        }   
    }catch(err){
        alert(err.response.data.message);
    }
}); 


