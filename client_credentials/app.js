/**
 * This is an example of a basic node.js script that performs
 * the Client Credentials oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#client_credentials_flow
 */

var express = require('express');
var request = require('request'); // "Request" library
var cookieParser = require('cookie-parser');

var client_id = '3b63f47549264ee18cce2d545ee4a355'; // Your client id
var client_secret = '71b69864ea2c44b68a74290cc0581074'; // Your client secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri


var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cookieParser());

app.get('/app_token', function(req, res) {
  
  // your application requests authorization
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {

      // use the access token to access the Spotify Web API
      var token = body.access_token;
      var options = {
        url: 'https://api.spotify.com/v1/users/1290213588/playlists/6YG9q2xBkPOyZlZFUSiHkN',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        json: true
      };
      request.get(options, function(error, response, body) {
        // console.log(body);
        res.send({
          'obj': response
        });
      });

    }
  });
});

console.log('Listening on 8888');
app.listen(8888);
