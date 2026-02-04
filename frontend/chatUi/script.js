// ---------------- DOM ELEMENTS ---------------- //
const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const messages = document.getElementById("chatMessages");

const searchInput = document.getElementById("searchEmail");
const joinBtn = document.getElementById("joinBtn");

// ---------------- CONFIG ---------------- //
const baseurl = "http://localhost:4000";
const token = localStorage.getItem("token");
const myEmail = localStorage.getItem("email");

// ---------------- SOCKET.IO CONNECTION ---------------- //
const socket = io("http://localhost:4000", {
  auth: { token }
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Socket error:", err.message);
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});

// ---------------- ROOM STATE ---------------- //
let currentRoomId = null;

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
  const roomId = [myEmail, receiverEmail].sort().join("_");

  // Leave previous room if exists
  if (currentRoomId) {
    socket.emit("leave_room", { roomId: currentRoomId });
  }

  // Join new room
  socket.emit("join_room", { roomId });
  currentRoomId = roomId;

  messages.innerHTML = "";
  console.log("Joined room:", roomId);
});

// ---------------- SEND PERSONAL MESSAGE ---------------- //
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text || !currentRoomId) return;

  socket.emit("new_message", {
    roomId: currentRoomId,
    message: text
  });

  input.value = "";
});

// ---------------- RECEIVE PERSONAL MESSAGE ---------------- //
socket.off("receive_message"); // prevent duplicate listeners
socket.on("receive_message", (data) => {
  const msgDiv = document.createElement("div");
  const type = data.email === myEmail ? "sent" : "received";
  msgDiv.classList.add('message', type);
  msgDiv.innerText = `${data.user}: ${data.text}`;
  messages.appendChild(msgDiv);
  messages.scrollTop = messages.scrollHeight;
});
