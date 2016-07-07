
var express    = require('express');				// call express
var app        = express() 					        // define our app using Express
var testRouter = require('./routes/test');	// import our testing routes  
var apiRouter  = require('./routes/api');		// import our actual api routes
var bodyParser = require('body-parser'); 	  // get body-parser
var morgan     = require('morgan'); 		    // used to see requests
var path			 = require('path');						// import filepath library
var config 		 = require('./config');		    // import config file


// ===================APP CONFIGURATION ==================

// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

// log all requests to the console 
app.use(morgan('dev'));


// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));


// =====================ROUTES=============================

var testRoutes = testRouter;			// a few test routes from test.js
app.use('/test', testRoutes);			// attach test routes router to main server instance

var apiRoutes = apiRouter;
app.use(apiRoutes);

// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES
app.get('/front', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/pages/front.html'));
});

app.get('/myfront', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/pages/myfront.html'));
});

app.get('/tables', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/pages/tables.html'));
});

app.get('', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/pages/front.html'));
});

// MAIN CATCHALL ROUTE --------------- 
// 404 ERROR ROUTING 
app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.send("<h1>404 " + req.url + "</h1>");
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('404 Not Found');
});

// =================START THE SERVER ========================
app.listen(config.port);
console.log('Node Server Running on Port ' + config.port);
