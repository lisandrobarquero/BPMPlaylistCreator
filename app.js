const express = require('express');
let app = express();
app.use(express.static(__dirname + '/public'));

app.listen(3000);
console.log('Listening on 8888')