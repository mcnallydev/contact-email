var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var Mailgun = require('mailgun-js');
var herokuIp = require('heroku-ip');
var controllers = require('./controllers');
//init express
var app = express();

// cors
app.use(cors());

// heroku ip
app.use(herokuIp(['production']));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

//Do something when you're landing on the first page
app.post('/:id', controllers.default);

app.listen(process.env.PORT || 5000);
