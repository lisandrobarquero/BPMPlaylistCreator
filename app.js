const express = require('express');
let app = express();
app.use(express.static(__dirname + '/public'));

console.log(process.env.PORT);

app.listen(process.env.PORT || 3002);
console.log('Listening on 8888')