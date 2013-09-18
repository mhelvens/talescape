//// Setup
//
var express = require('express');
var app     = express();


//// Other Global Variables
//
var port      = 80;
var rootDir   = __dirname + '/..';
var clientDir = rootDir + '/client';
var audioDir  = rootDir + '/audio';
var bowerDir  = rootDir + '/bower_components';


//// Configuration
//
app.configure(function() {
	app.use('/js/lib', express.static(bowerDir));
	app.use('/', express.static(clientDir));
});


//// Configuration during development only
//
app.configure('development', function() {
	port = 60044;
	
	app.use('/audio', express.static(audioDir));
});


//// Listen on the http port
//
app.listen(port);
