var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var util = require('util');

var url = util.format('mongodb://%s:%s@%s:%s/%s',
  process.env.APINIC_MOVIES_DB_USERNAME,
  process.env.APINIC_MOVIES_DB_PASSWORD,
  process.env.APINIC_MOVIES_DB_HOST,
  process.env.APINIC_MOVIES_DB_PORT,
  process.env.APINIC_MOVIES_DB_NAME);

var db = mongoose.createConnection(url);

db.on('open', function () {});

var files = fs.readdirSync(__dirname);

files.forEach(function(file) {
  var fileName = path.basename(file, '.js');
  if (fileName != 'index') {
    exports[fileName] = require('./' + fileName).setup(mongoose, db);
  }
});
