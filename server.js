var express = require("express");
var http = require("http");
var socketio = require("socket.io");

var app = express();
var server = http.createServer(app);
var io  = socketio.listen(server);



app.set('view engine', 'pug');

app.use('/bootstrap',  express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/jquery',  express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/linkifyjs',  express.static(__dirname + '/node_modules/linkifyjs/dist'));
app.use('/js',  express.static(__dirname + '/client/js'));
app.use('/css',  express.static(__dirname + '/client/css'));
app.use("/",function(req,res){ res.sendFile(__dirname + "/client/index.html"); });

server.listen(3000);

var chat = require("./server/chatserver.js");
chat(io);

console.log("Server running...");