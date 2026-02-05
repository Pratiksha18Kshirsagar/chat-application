const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const messages = document.getElementById("chatMessages");

const searchInput = document.getElementById("searchEmail");
const joinBtn = document.getElementById("joinBtn");

const groupBtn = document.getElementById("groupBtn");
const groupInput = document.getElementById("groupInput");

const mediaInput = document.getElementById("mediaInput");
const sendMediaBtn = document.getElementById("sendMediaBtn");

// ---------------- CONFIG ---------------- //
const baseurl = "http://localhost:4000";
const token = localStorage.getItem("token");
const myEmail = localStorage.getItem("email");
let roomId = null;
let groupId = null;

// ---------------- SOCKET.IO CONNECTION ---------------- //
const socket = io("http://localhost:4000", {
  auth: { token }
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});





// ---------------- JOIN ROOM  personal chat ---------------- //
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


// -----------group chat---------------
groupBtn.addEventListener("click", () => {
  const groupInputId = groupInput.value.trim();
  groupId = groupInputId;
  if (!groupInputId) {
    alert("Please enter the group Id");
    return;
  }
  socket.emit("join_Group", { groupId });

});



// ---------------- SEND MEDIA MESSAGE ---------------- //
sendMediaBtn.addEventListener("click", async () => {
  const file = mediaInput.files[0];
  if (!file) {
    alert("Select a file and join a chat first");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    // upload to backend
    const res = await axios.post(
      "http://localhost:4000/media/upload",
      formData
    );

    const mediaUrl = res.data.url;

    // send media message via socket
    socket.emit("media_message_sent", {
      roomId,
      mediaUrl,
      fileType: file.type
    });

    mediaInput.value = "";
  } catch (err) {
    console.error("Media upload failed", err);
  }
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

  socket.emit("Group-message", {
    groupId,
    message: text
  })

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





function appendMessage(text, type) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', type);
  msgDiv.innerHTML = `
    ${text}
    <div class="timestamp">${new Date().toLocaleTimeString()}</div> `;
  messages.appendChild(msgDiv);
  messages.scrollTop = messages.scrollHeight;
}

// -------- RECEIVE MEDIA MESSAGE  -------- //
socket.on("media_message", (data) => {
  const type = data.email === myEmail ? "sent" : "received";

  // Media message
  if (data.mediaUrl) {
    if (data.fileType.startsWith("image")) {
      appendMessage(
        `<img src="${data.mediaUrl}" width="200" />`,
        type
      );
    }
    else if (data.fileType.startsWith("video")) {
      appendMessage(
        `<video controls width="220">
           <source src="${data.mediaUrl}" type="${data.fileType}">
         </video>`,
        type
      );
    }
    else {
      appendMessage(
        `<a href="${data.mediaUrl}" target="_blank" download>
           📄 Download file
         </a>`,
        type
      );
    }
  }
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});