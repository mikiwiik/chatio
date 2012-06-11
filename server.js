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
  /*socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });*/

	// TODO: Act as a message broker
    socket.on('chat', function (data) {

        // TODO: allow defining alias for socket, like me=miki. Show that instead. Or define in client
        console.log("chat|" + socket.id +":" + JSON.stringify(data));

        //console.log(JSON.stringify(io.sockets.sockets));

        data.id = socket.id;
        // TODO: Add messageIs add sender id.

        socket.broadcast.emit('message', data);

        // Send to specific <namespace>.socket(<id>).send()
	});
});
