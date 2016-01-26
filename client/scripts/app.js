// YOUR CODE HERE:
$(document).ready(function(){

  var holder = {};
  // format: [username, msg]

  var currentRoom = '';
  
  var sanitizer = function (str) {
    return str.replace('&', '&#38')
      .replace('<', '&#60')
      .replace('>',  '&#61')
      .replace('"', '&#34')
      .replace("'", '&#39')
      .replace("/", '&#92');
  };

  var display = function(incoming) {
    console.log(incoming, holder)
    $('#chats').empty();
    for (var i = 0; i < holder[incoming].length; i++) {
      $('#chats').append(`<p><b>${holder[incoming][i][0]}</b>: ${holder[incoming][i][1]}</p>`);
    }
  };

  var makeRoomList = function(rooms) {
    for (var i = 0; i < rooms.length; i++) {
      if (rooms[i] !== '') {
        $('.rooms').append(`<option value="${rooms[i]}">${rooms[i]}</option>`);
      }
      else {
        $('.rooms').append(`<option value="default">Select a Room...</option>`);
      }
    }
  }

  // POST METHODS

  // var message = {
  //   username: 'hr38',
  //   text: 'extra nice',
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

  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    data: {'order': '-updatedAt'},
    success: function (data) {
      for(let i=0; i<data.results.length; i++) {
        // add post time
        let msg = data.results[i].text || '';
        let username = data.results[i].username || 'Anon';
        let roomname = data.results[i].roomname || '';
        msg = sanitizer(msg);
        username = sanitizer(username);
        roomname = sanitizer(roomname);
        Array.isArray(holder[roomname]) ? holder[roomname].push([username, msg]) : holder[roomname] = [[username, msg]];
      }
      console.log(data)
      makeRoomList(Object.keys(holder).sort());
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });

  $('select').on('change', function(e) {
    e.preventDefault();
    display($(this).val());
  });

});

