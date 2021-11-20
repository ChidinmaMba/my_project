const users = []; 
const rooms = [];
const{
  uid
} = require( '../makeIDS/uid');

function joinUsersList(id){
	//const userId = id;
	users.push(id);
	console.log(users);
	//return user's id and the id of their room
	const roomID = null;
	const hasRoom = 0;
	return {id, roomID, hasRoom};
}

function joinRoom(socket, user, io){
	if (user.hasRoom == 0){
		for(i = 0; i < rooms.length; i++){
			if(io.sockets.adapter.rooms.get(rooms[i]).size < 2){
				socket.join(rooms[i]);
				user.hasRoom = 1;
				console.log('Rooms: ', rooms);
				break;
			}
		}
                if(user.hasRoom == 0){
                        const roomId = uid();
                        rooms.push(roomId)
                        socket.join(roomId);
                        user.roomID = roomId;
                        console.log('Rooms:  ', rooms);
                        user.hasRoom = 1;
		}
	}
}

//when player disconnects
function disconnected(socket, user, io){
	let idx = users.indexOf(user.id);
	let room = user.roomID;
	let roomIdx = rooms.indexOf(room);
	console.log(idx);
	users.splice(idx, 1);
	console.log(`user ${user.id}`);
	console.log('Users:', users);

	if(getActiveRooms(io).includes(room)){
		rooms.splice(roomIdx, 1);
	}
	console.log('Rooms: ', rooms);
}

//removeFromRoom not tested
function removeFromRoom(socket, user, io){
	let idx = users.indexOf(user.id);
        let room = user.roomID;
        let roomIdx = rooms.indexOf(room);
        console.log(idx);
        users.splice(idx, 1);
        console.log(`user ${user.id}`);
        console.log('Users:', users);

        if(getActiveRooms(io).includes(room)){
                rooms.splice(roomIdx, 1);
        }
        console.log('Rooms: ', rooms);
}

function getActiveRooms(io) {
    // Convert map into 2D list:
    // ==> [['4ziBKG9XFS06NdtVAAAH', Set(1)], ['room1', Set(2)], ...]
    const arr = Array.from(io.sockets.adapter.rooms);
    // Filter rooms whose name exist in set:
    // ==> [['room1', Set(2)], ['room2', Set(2)]]
    const filtered = arr.filter(room => !room[1].has(room[0]))
    // Return only the room name: 
    // ==> ['room1', 'room2']
    const res = filtered.map(i => i[0]);
    return res;
}

module.exports = {
	joinUsersList,
	joinRoom,
	disconnected
};
