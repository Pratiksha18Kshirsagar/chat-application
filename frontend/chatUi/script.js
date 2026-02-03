const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const messages = document.getElementById("chatMessages");

const baseurl = "http://localhost:4000";
const token = localStorage.getItem("token");

// ---------------- SOCKET.IO ---------------- //
const socket = io("http://localhost:4000");

socket.on("connect", () => {
  console.log("Connected to server:", socket.id);
});

// receive message from server
socket.on("message", (data) => {
  const msgdiv = document.createElement("div");
  msgdiv.innerText = data;
  messages.appendChild(msgdiv);
  messages.scrollTop = messages.scrollHeight;
});

// ---------------- FORM SUBMIT ---------------- //
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  // send message via socket (real-time)
  socket.emit("message", text);

  // save message in DB
  await axios.post(
    `${baseurl}/chat/message`,
    { message: text },
    { headers: { Authorization: token } }
  );

  input.value = "";
});

// ---------------- LOAD OLD MESSAGES ---------------- //
const loadMessages = async () => {
  const res = await axios.get(`${baseurl}/chat/messages`, {
    headers: { Authorization: token }
  });

  messages.innerHTML = "";
  res.data.data.forEach((msg) => {
    const msgdiv = document.createElement("div");
    msgdiv.innerText = `${msg.userId} : ${msg.message}`;
    messages.appendChild(msgdiv);
  });

  messages.scrollTop = messages.scrollHeight;
};

loadMessages();

// ---------------- DISCONNECT ---------------- //
socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
