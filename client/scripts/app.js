// YOUR CODE HERE:
$(document).ready(function(){

  var holder = {};
  
  var sanitizer = function (str) {
    return str.replace('&', '&#38')
      .replace('<', '&#60')
      .replace('>',  '&#61')
      .replace('"', '&#34')
      .replace("'", '&#39')
      .replace("/", '&#92');
  };

  var display = function(incoming, username, msg) {
    if (incoming === currentRoom || !currentRoom) {
      $('#chats').append(`<p><b>${username}</b>: ${msg}</p>`);
    }
  };

  // POST METHODS

  // var message = {
  //   username: 'shawndrost',
  //   text: 'trololo',
  //   roomname: '4chan'
  // };

  // $.ajax({
  //   // This is the url you should use to communicate with the parse API server.
  //   url: 'https://api.parse.com/1/classes/chatterbox',
  //   type: 'POST',
  //   data: JSON.stringify(message),
  //   contentType: 'application/json',
  //   success: function (data) {
  //     console.log('chatterbox: Message sent');
  //   },
  //   error: function (data) {
  //     // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
  //     console.error('chatterbox: Failed to send message');
  //   }
  // });

  // GET METHODS
  var currentRoom = 'lobby';
  
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      for(let i=0; i<data.results.length; i++) {
        let msg = data.results[i].text || '';
        let username = data.results[i].username || 'Anon';
        let roomname = data.results[i].roomname || '';
        msg = sanitizer(msg);
        username = sanitizer(username);
        roomname = sanitizer(roomname);
        Array.isArray(holder[roomname]) ? holder[roomname].push([username, msg]) : holder[roomname] = [[username, msg]];
        display(roomname, username, msg);
      }
      console.log(holder)
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });

});

