var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs');

// NOTE: Ubuntu does not allow 80 for standard users
app.listen(8080);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {
    var nickBySocket = {};

	// TODO: Act as a message broker
    socket.on('chat', function (data) {
        // Retrieve nick if set, otherwise use the socket.id as client identifier
        data.client =  nickBySocket[socket.id] == undefined ?  socket.id : nickBySocket[socket.id];
        console.log("chat|" + data.client +":" + JSON.stringify(data));

        // TODO: Send to sender too.
        socket.broadcast.emit('message', data);

        // Send to specific <namespace>.socket(<id>).send()
	});

    // Set nick for specific client (=socket). Tell everyone
    socket.on('setNick', function (nick) {
        console.log("'setNick':" +  JSON.stringify(nick));
        nickBySocket[socket.id] = nick;
        socket.broadcast.emit('message', {message: " is now " + nick, client : nick});
    });
});