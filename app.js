var express = require('express');
var bodyParser = require('body-parser');
var Mailgun = require('mailgun-js');
var controllers = require('./controllers');
//init express
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

//Do something when you're landing on the first page
app.post('/:id', controllers.default);

app.listen(process.env.PORT || 5000);
