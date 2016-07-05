
//DEPENDENCIES//
var express = require('express');
var router = express.Router();

//test
router.use(function(req, res, next) {
	//console.log('Something is happening.');
	next();
});

//REST api welcome message (@ localhost:8080/api/)
router.get('/', function(req, res) {
    res.json({message:'welcome to our REST API'});
});

var test_data = {
	name:"bob",
	blah: "666",
	age:34
};


//add main route for ______
router.route('')
	.all(function(req, res, next) {
	  // runs for all HTTP verbs first
	  // think of it as route specific middleware!
	  next();
	})

	.post(function(req, res) {
		
		console.log("post to test_data at /api/test:")
		test_data = req.body;
		res.json({ message: 'an example POST response' });
		res.end()
		
	})

	.get(function(req, res) {
 
		console.log("get test_data from /api/test:")
		console.log(test_data)
		//res.json({ message: 'an example GET response' });
		res.send(JSON.stringify(test_data));
		res.end()
	  
    });
		
		

router.route('/error')
	
	.get(function(req, res, next){

		console.log("in error route")
		res.status(400);
		res.send('None shall pass');
	
	});

	
	
//export the router, so it can be imported in the main server.js file
module.exports = router;
