// YOUR CODE HERE:
$(document).ready(function(){
  
  var sanitizer = function (str) {
    return str.replace('&', '&#38')
      .replace('<', '&#60')
      .replace('>',  '&#61')
      .replace('"', '&#34')
      .replace("'", '&#39')
      .replace("/", '&#92');
  };

  var message = {
    username: 'shawndrost',
    text: 'trololo',
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

  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      for(let i=0; i<data.results.length; i++) {
        // console.log(data.results[i].text);
        let msg = data.results[i].text || '';
        let userName = data.results[i].username || 'Anon';
        msg = sanitizer(msg);
        userName = sanitizer(userName);
        $('#chats').append(`<p><b>${userName}</b>: ${msg}</p>`);
      }
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });

});

