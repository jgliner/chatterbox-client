// YOUR CODE HERE:
$(document).ready(function(){

  var holder = {};
  // format: [username, msg]

  var currentRoom = 'Unspecified';
  
  var sanitizer = function (str) {
    return str.replace(/\&/g, '&#38')
      .replace(/\</g, '&#60')
      .replace(/\>/g, '&#61')
      .replace(/\"/g, '&#34')
      .replace(/\'/g, '&#39')
      .replace(/\//g, '&#92');
  };

  var display = function(incoming) {
    console.log('DISP', incoming, holder);
    $('#chats').empty();
    incoming = sanitizer(incoming);
    if (currentRoom !== 'Unspecified') {
      for (var i = 0; i < holder[incoming].length; i++) {
        $('#chats').append(`<p><b>${holder[incoming][i][0]}</b>: ${holder[incoming][i][1]}</p>`);
      }
    }
  };

  var makeRoomList = function(rooms) {
    $('select').empty();
    $('.rooms').append(`<option>Choose a room</option>`);
    for (var i = 0; i < rooms.length; i++) {
      console.log(rooms[i])
      if (rooms[i] !== '' && !rooms[i].match(/(\&\#.{0,4}\;script)[\s\S]+|(\<script\>)[\s\S]+/igm)) {
        $('.rooms').append(`<option value="${rooms[i]}">${rooms[i]}</option>`);
      }
    }
  }

  // GET METHODS
  var init = function() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      contentType: 'application/json',
      data: {'order': '-updatedAt', 'limit': 1000},
      success: function (data) {
        holder = {};

        for(var i=0; i<data.results.length; i++) {
          // add post time
          var msg = data.results[i].text || ' ';
          var username = data.results[i].username || 'Anon';
          var roomname = data.results[i].roomname || 'Unspecified';
          msg = sanitizer(msg);
          username = sanitizer(username);
          roomname = sanitizer(roomname);
          if (roomname !== 'Unspecified') {
            Array.isArray(holder[roomname]) ? holder[roomname].push([username, msg]) : holder[roomname] = [[username, msg]];
          }
        }
        console.log(data)
        makeRoomList(Object.keys(holder).sort());
        display(currentRoom);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  };
  init();
  
  setInterval(function() {
    $('#chats').empty();
    init();
  }, 10000);

  $('select').on('change', function(e) {
    e.preventDefault();
    currentRoom = $(this).val();
    $("#currentRoom").text(currentRoom);
    display($(this).val());
  });


  // POST METHODS
  var message = {
    username: 'hr38',
    text: 'yet another message!!!',
    roomname: '4chan'
  };

  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });

  

});


