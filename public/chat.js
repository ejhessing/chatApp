$(function(){
  const socket = io.connect();
  const $messageForm = $('#messageForm');
  const $message = $('#message');
  const $chat = $('#chatWindow');
  const $usernameForm = $('#usernameForm');
  const $users = $('#users');
  const $username = $('#username');
  const $error = $('#error');

  $usernameForm.submit(function(e){
    e.preventDefault();
    socket.emit('new user', $username.val(), (data) => {
      if(data) {
        $('#userContainer').hide();
        $('#mainContainer').show();
      } else {
        $error.html('Username is taken, try something else ');
      }
    });
  });


  socket.on('usernames', (data) => {
    let html = '';
    for(var i = 0; i < data.length; i++) {
      html += data[i] + '<br>';
      $users.html(html);
    }
  });

  $messageForm.submit(function(e){
    e.preventDefault();
    socket.emit('send message', $message.val());
    $message.val('');
  });



  socket.on('new message', function(data){
    $chat.append('<span>' + data.user + "</span>: " + data.msg + '<br>');
  });

});
