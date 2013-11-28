 //// Setup
//
var express = require('express');
var app     = express();


 //// Other Global Variables
//
var port      = 60044;
var rootDir   = __dirname + '/..';
var clientDir = rootDir + '/client';
var audioDir  = rootDir + '/audio';
var bowerDir  = rootDir + '/bower_components';


 //// Configuration
//
app.use('/audio', express.static(audioDir));
app.use('/js/lib', express.static(bowerDir));
app.use('/Dam-Square-Experience', express.static(clientDir));
app.use('/', express.static(clientDir));


 //// Listen on the http port
//
app.listen(port);
