const express = require('express');
const axios = require('axios');
let app = express();
app.use(express.static(__dirname + '/public'));

console.log(process.env.PORT);

let port = process.env.PORT || 3002;
app.listen(port);
console.log('Listening on ' + port);