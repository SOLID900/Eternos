/**
 * Created by CyrilM on 20/12/2016.
 */

module.exports = function (io) {

    console.log("Chat init...");
    io.sockets.on("connection", OnConnection);

    users = [];
    connections = [];

    console.log("Chat initialized");

    function OnConnection(socket)
    {
        connections.push(socket);
        io.sockets.emit("connect success");
		socket.on("send message", OnSendMessage);
    }
    
    function OnSendMessage(data)
	{
		io.sockets.emit("new message", {msg: data});
	}
};

