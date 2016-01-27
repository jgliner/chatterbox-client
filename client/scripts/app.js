// YOUR CODE HERE:
$(document).ready(function(){

  var holder = {};
  // format: [username, msg]

  var lastId;

  var friends = [];

  var blocked = [];

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
    var friend;
    console.log('DISP', incoming, holder);
    incoming = sanitizer(incoming);
    if (currentRoom !== 'Unspecified') {
      console.log(friends)
      for (var i = 0; i < holder[incoming].length; i++) {
        var shortName = holder[incoming][i][0].replace(/\s/igm, '');
        friend = friends.indexOf(shortName) > -1 ? ' friend' : '';
        $('#chats').append(`<p class="${shortName}${friend}"><a class="user" href="#">${holder[incoming][i][0]}</a>: ${holder[incoming][i][1]}</p>`);
      }
    }
  };

  var makeRoomList = function(rooms) {
    $('select').empty();
    $('.rooms').append(`<option>Display a room</option>`);
    for (var i = 0; i < rooms.length; i++) {
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
          var msg = data.results[i].text || ' ';
          var username = data.results[i].username || 'Anon';
          var roomname = data.results[i].roomname || 'Unspecified';
          msg = sanitizer(msg);
          username = sanitizer(username);
          roomname = sanitizer(roomname);
          if (roomname !== 'Unspecified' && blocked.indexOf(username) === -1) {
            Array.isArray(holder[roomname]) ? holder[roomname].push([username, msg]) : holder[roomname] = [[username, msg]];
          }
        }
        lastId = data.results[data.results.length-1];
        console.log(data, 'LAST MSG', lastId);
        makeRoomList(Object.keys(holder).sort(function(a, b) {
          return a.toLowerCase().localeCompare(b.toLowerCase());
        }));
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

  $('#chats').on('click', '.user', function(e) {
    e.preventDefault();
    var un = $(this).text();
    un = un.replace(/\s/igm, '');
    $(`.${un}`).addClass('friend');
    friends.push(un);
  })

  $('select').on('change', function(e) {
    e.preventDefault();
    currentRoom = $(this).val();
    $('#chats').empty();
    $("#currentRoom").text(`Posting In: ${currentRoom}`);
    $('#currentUsername').text(`As: ${message.username}`);
    message.roomname = $(this).val();
    display($(this).val());
  });


  // POST METHODS
  var message = {
    username: 'Anonymous',
    text: '',
    roomname: 'lobby'
  };

  $('.newRoom').submit(function(e) {
    e.preventDefault();
    var newRoom = $(this).children('input').val();
    $('#chats').empty();
    $("#currentRoom").text(`Posting In: ${newRoom}`);
    message.roomname = newRoom;
    currentRoom = newRoom;
    display(newRoom);
    $(this).trigger('reset');
  });

  $('.setUsername').submit(function(e) {
    e.preventDefault();
    message.username = $(this).children('input').val();
    $('#currentUsername').text(`As: ${message.username}`);
    $(this).trigger('reset');
  });

  $('.blockUser').submit(function(e) {
    e.preventDefault();
    blocked.push($(this).children('input').val());
    $(this).trigger('reset');
  });

  $('.post').submit(function(e) {
    e.preventDefault();
    message.text = $(this).children('input').val();
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent:', JSON.stringify(message));
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
    $('#chats').prepend(`<p><a class="user" href="#">${message.username}</a>: ${message.text}</p>`);
    $(this).trigger('reset');
  });
});


