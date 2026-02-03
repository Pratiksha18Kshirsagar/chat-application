const form = document.getElementById('chatForm');
const input = document.getElementById('messageInput');
const messages = document.getElementById('chatMessages');
const baseurl = 'http://localhost:4000';

const token = localStorage.getItem('token');


//*---------------socket.io frontend-------------*//
const socket = io('http://localhost:4000');
socket.on("connect", () => {
  console.log("Connected to server:", socket.id);
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  messages.scrollTop = messages.scrollHeight; // auto-scroll
  socket.emit("message", text);
  input.value = '';

  const res = await axios.post(`${baseurl}/chat/message`, { message: text }, { headers: { Authorization: `${token}` } });
  loadMessages();

});

//*--------recieve data from server-------*//
socket.on("message", (data) => {
  const li = document.createElement("li");
  li.textContent = data;
  document.getElementById("messages").appendChild(li);
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


//*----handel disconnect-----*//
socket.on("disconnect", () => {
  console.log("Disconnected from server");
});


