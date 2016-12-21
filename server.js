/**
 * Created by CyrilM on 19/12/2016.
 */

var express = require("express");
var http = require("http");
var socketio = require("socket.io");

var app = express();
var server = http.createServer(app);
var io  = socketio.listen(server);



app.set('view engine', 'pug');
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
});

server.listen(3000);

var chat = require("./chat.js");
chat(io);

console.log("Server running...");