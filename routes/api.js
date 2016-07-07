
//DEPENDENCIES//
var express = require('express');
var mysql		= require('mysql');			    // import JS MYSQL driver
var config 	= require('../config');		    // import config file
var crypto	= require('crypto');			    // import hash functions


var router = express.Router();

// THIS IS A GLOBAL CONNECTION
// connect to our mysql database
var con = mysql.createConnection(config.mysql);

con.connect(function(err){
	
	if(err){
		console.log('Error connecting to DB: ' + config.mysql['database']);
		return;
	}
	console.log('Connection established to DB: ' + config.mysql['database']);
	
});

//login route
router.route('/login')

	.post(function(req, res, err) {
	
		//extract data from POST request
		loginData = req.body;		
		
		con.query(
			'SELECT * FROM Accounts WHERE user=?',
			[loginData.user],
			
			function(err,rows){
				
				//catch failed queries
				if(err){
					console.log(err);
					res.status(500).end();
				}
				
				//continue if user exists
				if(rows.length != 0){
					var user_hash = rows[0].pass;
					var salt = rows[0].salt;
					var user_pass = loginData.pass;
					var sha256_hash = crypto.createHash('sha256').update(user_pass + salt).digest("hex");
				
					//hash of entered password != hash in db
					if(sha256_hash !== user_hash){
						console.log("[!] Incorrect password for " + loginData.user);
						res.status(401).end();
					}
					
					res.status(200).end();
				}else{
					res.status(500).end();
				}

			}
		);
		
	});
	
	
	
	
	
//------ SIGNUP Route -------
router.route("/signup")

	.post(function(req,res,err){

		//extract data from POST request
		signupData = req.body;
		var user = signupData.user;
		var pass = signupData.pass;
		var rep = signupData.rep;
		
		//generate random salt (10 hex chars)
		var salt = randomValueHex(10);
		
		//hash the given password with the random salt
		var hash = crypto.createHash('sha256').update(pass + salt).digest("hex");
		
		con.query(
			'INSERT INTO Accounts(user,pass,rep,salt) VALUES (?,?,?,?)',
			[user,hash,rep,salt],
			
			//query response
			function(err,resp){
			
				//catch failed queries
				if(err){
					console.log(err);
					res.status(500).end();
				}
				
				// return success: HTTP 200
				res.status(200).end();
			}
		);
		
	});
	
	//------ ADD FRIEND Route -------
router.route("/friends")
	.post(function(req,res,err){
		
		//extract data from request body
		friendData = req.body;
		var friendError = false;
		var user1 = friendData.user1;
		var user2 = friendData.user2;
		
		//DEBUG code
		console.log("Add friends: " + user1 + ", " + user2)
		
		//execute Add Friends query using GLOBAL db connection
		con.query(
			'INSERT INTO Friends(user1,user2) VALUES (?,?)',
			[user1,user2],				//vars replace ?'s in the sql statements
			
			//query response
			function(err,resp){
				
				//catch failed queries
				if(err){
					console.log(err);
					res.status(500).end();
				}
				
				// return success: HTTP 200
				res.status(200).end();
			}
		);
		
	});

		//------ DEFAULT SUBS Route -------
router.route("/s")
	.get(function(req,res, err){
		
		//catch error in request
		if(err){
			console.log(err);
			res.status(500); //return a Internal Server Error (500)
		}

		con.query( 'SELECT * FROM Subsaiddits WHERE def = 1;',
			function(err,rows){
				
				console.log(rows);
				
				if(err){
					console.log(err);
					res.status(500).end();
				}
				
				if(rows != null){
						console.log(rows.length);
						res.status(200).send(JSON.stringify(rows));
				}else{
						
						res.status(500).end();
				}
			}
		);

	});
	
		//------ USERS Route -------
router.route("/users")
	.get(function(req,res, err){
		
		
		//catch error in request
		if(err){
			console.log(err);
			res.status(500); //return a Internal Server Error (500)
		}

		con.query( 'SELECT * FROM Accounts;',
			function(err,rows){
				
				console.log(rows);
				
				if(err){
					console.log(err);
					res.status(500).end();
				}
				
				if(rows != null){
						res.status(200).send(JSON.stringify(rows));
				}else{
						res.status(500).end();
				}
			}
		);

	});
	
	
			//------ DEFAULT FRONT PAGE Route -------
router.route("/top")

	.get(function(req,res, err){
		
		//catch error in request
		if(err){
			console.log(err);
			res.status(500); //return a Internal Server Error (500)
		}

		con.query( 'SELECT Posts.*, (Posts.upvotes - Posts.downvotes) AS rating\
					FROM Posts \
					JOIN\
					(SELECT title FROM Subsaiddits WHERE def = 1) Defaults\
					ON Posts.subsaiddit = Defaults.title\
					ORDER BY rating DESC\
					LIMIT 10;'
					,
					
					
			function(err,rows){
				
				if(err){
					console.log(err);
					res.status(500).end();
				}
				
				if(rows != null){
						console.log(rows);
						console.log(rows.length);
						res.status(200).send(JSON.stringify(rows));
				}else{
						res.status(500).end();
				}
			}
		);

	});

	//returns a random hex value
	function randomValueHex (len) {
		return crypto.randomBytes(Math.ceil(len/2))
			.toString('hex') // convert to hexadecimal format
			.slice(0,len);   // return required number of characters
	}
		
	
//export the router, so it can be imported in the main server.js file
module.exports = router;