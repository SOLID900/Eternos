module.exports = ChatServer;

function ChatServer(io) {
	
	console.log("Chat init...");
	io.sockets.on("connection", OnConnection);
	
	var connections = {};
	
	var sanitizer = require('sanitizer');
	
	console.log("Chat initialized");
	
	function OnConnection(socket) {
		var newID = GetNewID();
		connections[newID] = {socket: socket, user:null};
		socket.emit("connect success", {id: newID});
		socket.on("send message", function(data) { OnSendMessage(newID, data); } );
		socket.on("new user", function(data, callback) { OnNewUser(newID, data, callback); } );
		
		socket.on("disconnect", function(socket) { OnDisconnection(newID, socket); } );
	}
	
	function OnSendMessage(id, data) {
		io.sockets.emit("new message", {user: connections[id].user, message: sanitizer.escape(data.message)});
	}
	
	function OnNewUser(id, data, callback)
	{
		connections[id].user = {name: data.username};
		
		callback(true, data.username);
		
		var users = [];
		for (var key in connections) {
			if (connections.hasOwnProperty(key)) {
				if (connections[key])
					users.push(connections[key].user);
			}
		}
		
		io.sockets.emit("new user", {user: connections[id].user, users: users});
	}
	
	function OnDisconnection(id, socket)
	{
		var disconnectedUser = connections[id];
		connections[id] = null;
		//connections.splice(connections.indexOf(socket), 1)[0];
		
		var users = [];
		for (var key in connections) {
			if (connections.hasOwnProperty(key)) {
				if (connections[key])
					users.push(connections[key].user);
			}
		}
		io.sockets.emit("user disconnect", {user: disconnectedUser.user, users: users});
	}
	
	function GetNewID()
	{
		return Math.ceil( Math.random() * 0x10000 );
	}
}

