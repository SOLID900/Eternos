var socket = io.connect();
var $chatBody = $("#chat-body");
var $messageArea = $("#messageArea");
var $messageForm = $("#messageForm");
var $message = $("#message");

var $usernameArea = $("#usernameArea");
var $usernameForm = $("#usernameForm");
var $usernameinput = $("#username-input");

var $currentusername = $("#current-username");
var $connecteduser = $("#connected-user");

var isConnected = false;

var myID = -1;

var users = [];
var me = null;

$messageForm.submit(function(event)
{
	event.preventDefault();
	var myMessage = $message.val();
	
	if (myMessage[0] != '/')
	{
		socket.emit("send message", {message: $message.val()});
	}
	else
	{
		var command = myMessage.slice(1);
		executeCommand(command);
	}
	$message.val("");
	
});

$usernameForm.submit(function (event) {
	event.preventDefault();
	socket.emit("new user", { username: $usernameinput.val() }, function(data, username)
	{
		$usernameArea.hide();
		$messageArea.show();
		isConnected = true;
		$currentusername.html("You are <b>" + username + "</b>");
		updateUser();
	});
	$usernameinput.val("");
});

socket.on("connect success", function (data)
{
	myID = data.id;
});

socket.on("new message", function (data)
{
	if (isConnected)
	{
		var options = {/* … */};
		var message = linkifyHtml(data.message, options);
		$chatBody.append('<div class="chat-element"><b>' + data.user.name + '</b>: ' + message + '</div>');
		setToBottom();
	}
});

socket.on("new user", function (data)
{
	if (isConnected)
	{
		$chatBody.append('<div class="chat-element"><i> ' + data.user.name + ' joined !</i></div>');
		setToBottom();
		users = data.users;
		updateUser();
	}
});

socket.on("user disconnect", function (data)
{
	if (isConnected)
	{
		$chatBody.append('<div class="chat-element"><i> ' + data.user.name + ' disconnected</i></div>');
		setToBottom();
		users = data.users;
		updateUser();
	}
});

function executeCommand(command)
{
	var commandarray = command.split("~");
	var commandtype = commandarray[0];
	var commandparameter = commandarray.slice(1);
	switch (commandtype)
	{
		case "help":
			$chatBody.append('<div class="chat-element"> Command available:<br/>' +
				'<i>/help</i> : What you just typed<br/>' +
				'</div>');
			setToBottom();
			break;
		default:
			$chatBody.append('<tr><td><div class="chat-element"> Command "<i>' + command + '</i>" unknow.</div></td></tr>');
			setToBottom();
	}
}

function updateUser()
{
	$connecteduser.html("");
	for (i = 0; i < users.length; i++)
	{
		$connecteduser.append('<div>' + users[i].name + '</div>');
	}
}

function setToBottom()
{
	$chatBody.animate({ scrollTop: $chatBody[0].scrollHeight}, (30/60)*1000);
}