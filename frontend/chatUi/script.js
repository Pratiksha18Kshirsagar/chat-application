const form = document.getElementById('chatForm');
const input = document.getElementById('messageInput');
const messages = document.getElementById('chatMessages');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', 'sent');

  const time = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  msgDiv.innerHTML = `
    <p>${text}</p>
    <span class="time">${time}</span>
  `;

  messages.appendChild(msgDiv);
  messages.scrollTop = messages.scrollHeight; // auto-scroll
  input.value = '';
});
