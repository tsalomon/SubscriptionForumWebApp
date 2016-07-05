
//DEPENDENCIES//
var express = require('express');
var mysql		= require('mysql');			    // import JS MYSQL driver
var config 	= require('../config');		    // import config file
var crypto	= require('crypto');			    // import hash functions


var router = express.Router();

// connect to our mysql database
var con = mysql.createConnection(config.mysql);

con.connect(function(err){
	
	if(err){
		console.log('Error connecting to Db');
		return;
	}
	console.log('Connection established to DB: ' + config.mysql['database']);
	
});

//login route
router.route('/login')

	.post(function(req, res) {
	
		loginData = req.body;		
		var loginError = false;
		
		con.query(
			'SELECT * FROM Accounts WHERE user=?',
			[loginData.user],
			function(err,rows){
				
				if(rows.length == 0){
					loginError = true;
				}else{
					var user_hash = rows[0].pass;
					var salt = rows[0].salt;
					var user_pass = loginData.pass;
					var sha256_hash = crypto.createHash('sha256').update(user_pass + salt).digest("hex");
				
					if(sha256_hash !== user_hash){
						loginError = true;
					}
				}
				
				if(loginError){
					res.json({"error":true})
					res.status(401).send();
					res.end();
				}else{
					res.json({"error":false})
					res.status(200).send();
					res.end();
				}
			}
		);
		
	});
	
	
//------ SIGNUP Route -------
router.route("/signup")
	.post(function(req,res){
		
		signupData = req.body;
		var signupError = false;
		
		function randomValueHex (len) {
			return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len);   // return required number of characters
		}
		
		var user = signupData.user;
		var pass = signupData.pass;
		var salt = randomValueHex(10);
		var hash = crypto.createHash('sha256').update(pass + salt).digest("hex");
		var rep = signupData.rep;
		
		con.query(
			'INSERT INTO Accounts(user,pass,rep,salt) VALUES (?,?,?,?)',
			[user,hash,rep,salt],
			function(err,resp){
				if(err){
					signupError = true;
				} 
				
				if(signupError){
					res.json({"error":true})
					res.status(401).send();
					res.end();
				}else{
					res.json({"error":false})
					res.status(200).send();
					res.end();
				}
			}
		);
		
	});
	
	//------ ADD FRIEND Route -------
router.route("/friends")
	.post(function(req,res,err){
		
		
		if(err){
			console.log(err);
			res.status(500);
		}
		
		
		friendData = req.body;
		var friendError = false;
		var user1 = friendData.user1;
		var user2 = friendData.user2;
		
		console.log("Add friends: " + user1 + ", " + user2)
		
		
		con.query(
			'INSERT INTO Friends(user1,user2) VALUES (?,?)',
			[user1,user2],
			function(err,resp){
				if(err){
					console.log(err);
					res.status(500).end();
				}
				
				//res.send(JSON.stringify(resp));
				res.status(200).end();
			}
		);
		
	});
	
	
		//------ FRONT PAGE Route -------
router.route("/s")
	.get(function(req,res){

		con.query( 'SELECT title, description, creator FROM Subsaiddits WHERE def=1;',
			function(err,rows){
				
				if(err){
					console.log(err);
					res.status(500).end();
				}
				
				res.send(JSON.stringify(rows));
				res.status(200).end();
				
			}
		);

	});


//export the router, so it can be imported in the main server.js file
module.exports = router;