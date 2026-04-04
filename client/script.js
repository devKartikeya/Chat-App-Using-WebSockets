const socket = new WebSocket("ws://localhost:3000");
const button = document.getElementById('button');
const input = document.getElementById('input');

const username = prompt('Enter your name !');

socket.onopen = () => {
    console.log('Connected to the Server !');
    socket.send(JSON.stringify({ type: 'join', username: username }));
}

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(data);

    const chatBox = document.getElementById('chat-box');

    if (data.type == 'join') {
        const element = document.createElement('div');
        element.classList.add('message', 'received');
        element.innerHTML = `<span class="username-received">${data.user} : </span><span>${data.message}</span>`;
        chatBox.appendChild(element);
    }
    if (data.type == 'chat' && data.user !== username) {
        const element = document.createElement('div');
        element.classList.add('message', 'received');
        element.innerHTML = `<span class="username-received">${data.user} : </span><span>${data.message}</span>`;
        chatBox.appendChild(element);
    }
}

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

function sendMessage() {
    const value = input.value;
    if (!value.trim()) return; // prevent empty messages

    socket.send(JSON.stringify({ type: 'chat', data: value, user: username }));

    const chatBox = document.getElementById('chat-box');
    const element = document.createElement('div');
    element.classList.add('message', 'sent');
    element.innerHTML = `<span class="username-sent">${username} : </span><span>${value}</span>`;
    chatBox.appendChild(element);

    input.value = ''; // ✅ clears input after sending
}

button.onclick = sendMessage;

socket.onerror = (error) => {
    console.log('An Error occured !', error);
}

socket.onclose = () => {
    console.log('Socket is closing !');
}
