const form = document.getElementById('chatForm');
const input = document.getElementById('messageInput');
const messages = document.getElementById('chatMessages');
const baseurl = 'http://localhost:4000';
const token = localStorage.getItem('token');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  messages.scrollTop = messages.scrollHeight; // auto-scroll
  input.value = '';

  const res = await axios.post(`${baseurl}/chat/message`, { message: text }, { headers: { Authorization: `${token}` } });
  loadMessages();

});


const loadMessages = async () => {

  const res = await axios.get(`${baseurl}/chat/messages`, { headers: { Authorization: `${token}` } });
  console.log(res.data.data);
  messages.innerHTML = '';
  res.data.data.forEach(msg => {
    const msgdiv = document.createElement('div');
    msgdiv.innerText = `${msg.userId} : ${msg.message}`;
    messages.appendChild(msgdiv);
  })

}


loadMessages();




