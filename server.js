const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);


app.use(express.static(path.join(__dirname, 'client')))

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

const{
  uid
} = require( './makeIDS/uid');

const {
  joinUsersList,
  joinRoom,
  disconnected
} = require('./utils/users');

io.on('connection', (socket) => {
	//console.log(`Player with IP: ${socket.handshake.address} has connected...`);
        console.log("New Player");
	
	var user;
        socket.on('joinRoom', (id) =>{
		user = joinUsersList(id);
		joinRoom(socket, user, io);
        });

	socket.on('disconnecting', () =>{
		disconnected(socket, user, io);
	});
});
