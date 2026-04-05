const server = require('ws');

const wss = new server.Server({ port: 3000 }, () => {
    console.log("WebSocket server running on ws://localhost:3000");
});

const clients = new Map();

wss.on('connection', (socket) => {
    console.log('A New Client Connected !');

    socket.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'join') {
            clients.set(socket, data.username);
            console.log(`${data.username} joined the chat !`);
            clients.forEach((client, socket) => {
                socket.send(JSON.stringify({ user: data.username, message: 'Joined the Chat !', type: data.type }))
            })
        }

        if (data.type == 'chat') {
            clients.forEach((client, socket) => {
                socket.send(JSON.stringify({ user: data.user, message: data.data, type: data.type }));
            })
        }
    });

    socket.on('close', () => {
        console.log('A client disconnected !');
    });
    socket.on('error', (error) => {
        console.log('An error occurred: ', error);
    });
});
