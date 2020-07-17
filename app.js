const express = require('express');
let app = express();

let port = process.env.PORT || 8888;

console.log('Listening on ' + port);
app.use(express.static(__dirname + '/public'))
app.listen(port);