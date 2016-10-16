const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const usernames = [];

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', (socket) => {
  socket.on('new user', (data, callback) => {
    if(usernames.indexOf(data) != -1) {
      callback(false);
    } else {
      callback(true);
      socket.username = data;
      usernames.push(socket.username);
      updateUserNames();
    }
  });

  function updateUserNames() {
    io.sockets.emit('usernames', usernames);
  };

  socket.on('send message', (data) => {
      io.sockets.emit('new message', { msg: data, user:socket.username});
  });

  socket.on('disconnect', (data) => {
    if(!socket.username) {
      return;
    }

    usernames.splice(usernames.indexOf(socket.usernamer), 1);
    updateUserNames();
  });
});


server.listen(PORT);
