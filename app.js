const express = require('express');
const axios = require('axios');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require ('cookie-parser');
require ('dotenv').config();

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

let stateKey = 'spotiy_auth_state';

let app = express();

app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser());

app.get('/login', (req, res) => {
    let state = generateRandomString(16);
    res.cookie(stateKey, state);

    let scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' + 
        querystring.stringify({
            response_type: 'code',
            client_id: clientId,
            scope: scope,
            redirect_uri: redirectURI,
            state: state
        }));
});

app.get('/callback', (req, res) =>{
    let code = req.query.code || null;
    let state = req.query.state || null;
    let storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState){
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            })
        );
        
    }
    else{
        res.clearCookie(stateKey);
        const optionsPost = {
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Authorization': 'Basic ' + (new Buffer (clientId + ':' + clientSecret).toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            params:{
                code: code,
                redirect_uri: redirectURI,
                grant_type: 'authorization_code'
            },
            json: true
        };

        axios(optionsPost).then(response => {

            if (response.status === 200){
                let accessToken = response.data.access_token;
                let refreshToken = response.data.refresh_token;

                const optionsGet = {
                    method: 'get',
                    url: 'https://api.spotify.com/v1/me',
                    headers: {'Authorization' : 'Bearer ' + accessToken},
                    json: true
                };
                axios.get(optionsGet).then (response => {
                    res.redirect ('/#' + querystring.stringify(
                        {
                        access_token: accessToken,
                        refresh_token: refreshToken
                    
                        })
                    );
                })
                .catch(e => {
                    res.redirect('/#' + querystring.stringify({error: e.response.data}));
                });
            }
            else{
                res.redirect('/#' + querystring.stringify({error: 'invalid_token'}));
            }
        })
        .catch(e => {
            console.error('error ' + e.response.data);
        });
    }
});

app.get('/refresh_token', function(req, res){

    let refreshToken = req.query.refresh_token;
    const options = {
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (new Buffer(clientID + ':' + clientSecret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: {
            grantType: 'refresh_token',
            refresh_token = refreshToken
        },
        json: true
    };

    axios(options).then (response =>{
        if (response.status === 200){
            let accessToken = response.data.access_token;
            res.send ({
                access_token: accessToken
            });
        }
    }).catch(e => {
        console.log('error ' + e.response.data)
    });
});


let port = process.env.PORT || 3002;
app.listen(port);
console.log('Listening on ' + port);