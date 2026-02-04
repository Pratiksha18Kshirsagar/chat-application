const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const messages = document.getElementById("chatMessages");

const searchInput = document.getElementById("searchEmail");
const joinBtn = document.getElementById("joinBtn");

// ---------------- CONFIG ---------------- //
const baseurl = "http://localhost:4000";
const token = localStorage.getItem("token");
const myEmail = localStorage.getItem("email");
let roomId = null;
// ---------------- SOCKET.IO CONNECTION ---------------- //
const socket = io("http://localhost:4000", {
  auth: { token }
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});


socket.on("disconnect", () => {
  console.log("Socket disconnected");
});


// ---------------- JOIN ROOM (EMAIL BASED) ---------------- //
joinBtn.addEventListener("click", () => {
  const receiverEmail = searchInput.value.trim();

  if (!receiverEmail) {
    alert("Please enter an email");
    return;
  }

  if (receiverEmail === myEmail) {
    alert("You cannot chat with yourself");
    return;
  }

  // Create unique room ID (sorted emails)
  roomId = [myEmail, receiverEmail].sort().join("_");

  // Join new room
  socket.emit("join_room", { roomId });
 

  messages.innerHTML = "";
  console.log("Joined room:", roomId);
});

// ---------------- SEND PERSONAL MESSAGE ---------------- //
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  socket.emit("new_message", {
    roomId: roomId,
    message: text
  });

  input.value = "";
});



socket.on("receive_message", (data) => {
  const msgDiv = document.createElement("div");
  const type = data.email === myEmail ? "sent" : "received";

  msgDiv.classList.add('message', type);
  msgDiv.innerText = `${data.user}: ${data.text}`;
  
  messages.appendChild(msgDiv);
  messages.scrollTop = messages.scrollHeight;
});
