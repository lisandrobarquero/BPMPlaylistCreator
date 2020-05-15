const express = require('express');
let app = express();
app.use(express.static(__dirname + '/public'));

app.listen(8888);
console.log('Listening on 8888')