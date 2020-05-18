const express = require('express');
const axios = require('axios');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require ('cookie-parser');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.SECRET;
const redirectURI = 'https://bpm-playlist-creator.herokuapp.com/callback';


/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
let generateRandomString = function(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };


const app = express();
app.use(express.static(__dirname + '/public'));

console.log(process.env.PORT);

let port = process.env.PORT || 3002;
app.listen(port);
console.log('clientId ' +clientId);
console.log('Listening on ' + port);