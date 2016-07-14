//DEPENDENCIES//
var express = require('express');
var mysql = require('mysql'); // import JS MYSQL driver
var config = require('../config'); // import config file
var crypto = require('crypto');
var querystring = require("querystring"); // import hash functions


var router = express.Router();

// THIS IS A GLOBAL CONNECTION
// connect to our mysql database
var con = mysql.createConnection(config.mysql);

con.connect(function(err) {

    if (err) {
        console.log('Error connecting to DB: ' + config.mysql['database']);
        return;
    }
    console.log('Connection established to DB: ' + config.mysql['database']);

});

//login route
router.route('/login')

.post(function(req, res, err) {

    //extract data from POST request
    var loginData = req.body;

    con.query(
        'SELECT * FROM Accounts WHERE user=?', [loginData.user],

        function(err, rows) {

            //catch failed queries
            if (err) {
                console.log(err);
                res.status(500).end();
            }

            //continue if user exists
            if (rows.length != 0) {
                var user_hash = rows[0].pass;
                var salt = rows[0].salt;
                var user_pass = loginData.pass;
                var sha256_hash = crypto.createHash('sha256').update(user_pass + salt).digest("hex");

                //hash of entered password != hash in db
                if (sha256_hash !== user_hash) {
                    console.log("[!] Incorrect password for " + loginData.user);
                    res.status(401).end();
                }

                //if correct password, send url to redirect to 
                res.contentType('application/json');
                var data = JSON.stringify('/myfront?user=' + loginData.user)
                res.header('Content-Length', data.length);
                res.status(200).end(data);

            } else {
                res.status(500).end();
            }

        }
    );

});




//------ SIGNUP Route -------
router.route("/signup")

.post(function(req, res, err) {

    //extract data from POST request
    var signupData = req.body;
    var user = signupData.user;
    var pass = signupData.pass;
    var rep = signupData.rep;

    //generate random salt (10 hex chars)
    var salt = randomValueHex(10);

    //hash the given password with the random salt
    var hash = crypto.createHash('sha256').update(pass + salt).digest("hex");

    con.query(
        'INSERT INTO Accounts(user,pass,rep,salt) VALUES (?,?,?,?)', [user, hash, rep, salt],

        //query response
        function(err, resp) {

            //catch failed queries
            if (err) {
                console.log(err);
                res.status(500).end();
            }

            // return success: HTTP 200
            res.status(200).end();
        }
    );

});



//------ Subscribe Route -------

router.route("/subscribe")

.post(function(req, res, err) {
    console.log("in subscribe route")

    var data = req.body;

    con.query("INSERT INTO Subscribers(user, subsaiddit) VALUES (?,?);", [data.user, data.subs],

        function(qError, rows) {

            if (qError) {
                console.log("subscribe: " + qError);
                return res.status(500).send(qError.message)
            };

            if (rows != null) {
                console.log("in subscribe query")
                console.log(rows);
                console.log(rows.length);
                res.status(200).send(rows);
            }

        }
    );

});

router.route("/fav")

.post(function(req, res, err) {

    var data = req.body;

    con.query("INSERT INTO Favourites(user, post_id) VALUES (?,?);", [data.user, data.post_id],

        function(qError, rows) {

            if (qError) {
                console.log("Favourite: " + qError);
                return res.status(500).send(qError.message)
            };

            if (rows != null) {
                console.log(rows);
                console.log(rows.length);
                res.status(200).send(rows);
            }

        }
    );

});


router.route("/cvote")

.post(function(req, res, err) {

    var data = req.body;

    con.query("INSERT INTO CommentVotes(user, comment_id, upvote) VALUES (?,?,?);", 
	
		[data.user, data.c_id, parseInt(data.upvote)],

        function(qError, rows) {

            if (qError) {
                console.log("Cvote: " + qError);
                return res.status(500).send(qError.message)
            };

            if (rows != null) {
                res.status(200).send(rows);
            }

        }
    );

});

router.route("/pvote")

.post(function(req, res, err) {

    var data = req.body;

    con.query("INSERT INTO PostVotes(user, post_id, upvote) VALUES (?,?,?);", 
	
		[data.user, data.p_id, parseInt(data.upvote)],

        function(qError, rows) {

            if (qError) {
                console.log("Pvote: " + qError);
                return res.status(500).send(qError.message)
            };

            if (rows != null) {
                console.log(rows);
                console.log(rows.length);
                res.status(200).send(rows);
            }

        }
    );

});



//------ POST Route -------
router.route("/post")
    .post(function(req, res, err) {

        //extract data from request body
        var subData = req.body;
        console.log(JSON.stringify(subData));

        //
        for (var attr in subData) {
            //console.log(str.normalize())
            subData[attr] = subData[attr].normalize()
            console.log(subData[attr])

        }

        //DEBUG code
        //console.log("subscribe: " + subData.subsaiddit + "Def: " + subData.def)
        console.log("addpost" + JSON.stringify(subData));

        //execute query using GLOBAL db connection
        con.query(
            'INSERT INTO Posts(title, text, url, upvotes, downvotes, creator, subsaiddit)\
			VALUES (?,?,?,?,?,?,?);', [
                subData.title,
                subData.text,
                subData.url,
                parseInt(subData.upvotes),
                parseInt(subData.downvotes),
                subData.creator,
                subData.subs
            ], //vars replace ?'s in the sql statements

            //query response
            function(error, rows) {

                //catch failed queries
                if (error) {
                    console.log(error);
                    return res.status(500).send(error.message)
                }

                // return success: HTTP 200
                res.status(200).end();
            }
        );

    })
    .delete(function(req, res, err) {

        //catch error in request
        if (err) {
            console.log(err);
            res.status(500); //return a Internal Server Error (500)
        }

        //extract data from request body
        var data = req.body;
        console.log(JSON.stringify(data));

        //
        for (var attr in data) {
            //console.log(str.normalize())
            data[attr] = data[attr].normalize()
            console.log(data[attr])
        }

        //DEBUG code
        //console.log("subscribe: " + data.subsaiddit + "Def: " + data.def)
        console.log("delete post: " + data.id);

        //execute query using GLOBAL db connection
        con.query(
            'DELETE FROM Posts WHERE Posts.id = ?', [data.id],

            //query response
            function(qError, rows) {

                //catch failed queries
                if (qError) {
                    console.log(qError);
                    return res.status(500).send(qError.message)
                }

                // return success: HTTP 200
                res.status(200).send(rows);
            }
        );

    });



//------ ADD SUB Route -------
router.route("/addSub")
    .post(function(req, res, err) {

        //extract data from request body
        subData = req.body;

        //DEBUG code
        console.log("Adding subsaiddit: " + subData.title + "Def: " + subData.def)

        //execute query using GLOBAL db connection
        con.query(
            'INSERT INTO  Subsaiddits(title, def, description, creator) \
 			VALUES (?,?,?,?);', 
			[
			subData.title, 
			parseInt(subData.def), 
			subData.desc, 
			subData.creator
			],

            //query response
            function(err, resp) {

                //catch failed queries
                if (err) {
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
    .post(function(req, res, err) {

        //extract data from request body
        friendData = req.body;
        var friendError = false;
        var user1 = friendData.user1;
        var user2 = friendData.user2;

        //DEBUG code
        console.log("Add friends: " + user1 + ", " + user2)

        //execute Add Friends query using GLOBAL db connection
        con.query(
            'INSERT INTO Friends(user1,user2) VALUES (?,?)', [user1, user2], //vars replace ?'s in the sql statements

            //query response
            function(err, resp) {

                //catch failed queries
                if (err) {
                    console.log(err);
                    res.status(500).end();
                }

                // return success: HTTP 200
                res.status(200).end();
            }
        );

        //execute Add Friends query using GLOBAL db connection
        con.query(
            'INSERT INTO Friends(user1,user2) VALUES (?,?)', [user2, user1], //vars replace ?'s in the sql statements

            //query response
            function(err, resp) {

                //catch failed queries
                if (err) {
                    console.log(err);
                    res.status(500).end();
                }

                // return success: HTTP 200
                res.status(200).end();
            }
        );

    });

//------ DEFAULT SUBS Route -------
router.route("/defsubs")
    .get(function(req, res, err) {

        //catch error in request
        if (err) {
            console.log(err);
            res.status(500); //return a Internal Server Error (500)
        }

        con.query('SELECT * FROM Subsaiddits WHERE def = 1;',
            function(err, rows) {

                console.log(rows);

                if (err) {
                    console.log(err);
                    res.status(500).end();
                }

                if (rows != null) {
                    console.log(rows.length);
                    res.status(200).send(JSON.stringify(rows));
                } else {

                    res.status(500).end();
                }
            }
        );

    });




//------ USERS Route -------
router.route("/users")
    .get(function(req, res, err) {


        //catch error in request
        if (err) {
            console.log(err);
            res.status(500); //return a Internal Server Error (500)
        }

        var u = req.query.user;

        if (u == null) {
            u = '%';
        }
        console.log(u)

        con.query('SELECT * FROM Accounts WHERE user LIKE ?;', [u],
            function(err, rows) {

                console.log(rows);

                if (err) {
                    console.log(err);
                    res.status(500).end();
                }

                if (rows != null) {
                    res.status(200).send(JSON.stringify(rows));
                } else {
                    res.status(500).end();
                }
            }
        );

    });



//------ DEFAULT FRONT PAGE Route -------
router.route("/my")

.get(function(req, res, err) {

    //catch error in request
    if (err) {
        console.log(err);
        res.status(500); //return a Internal Server Error (500)
    }

    var u = req.query.user;

    if (u == null) {
        u = '%';
    }
    console.log(u)

    con.query('SELECT Posts.*, (Posts.upvotes - Posts.downvotes) AS rating\
					FROM Posts \
					JOIN\
					(SELECT subsaiddit FROM Subscribers WHERE user LIKE ?)Subbed\
					ON Subbed.subsaiddit = Posts.subsaiddit\
					ORDER BY rating DESC\
					LIMIT 10;', [u],

        function(err, rows) {

            if (err) {
                console.log(err);
                res.status(500).end();
            }

            if (rows != null) {
                console.log(rows);
                console.log(rows.length);
                res.status(200).send(JSON.stringify(rows));
            } else {
                res.status(500).end();
            }
        }
    );

});


//------ Subscribed Subsaiddits Route -------
router.route("/subsubs")

.get(function(req, res, err) {

    //catch error in request
    if (err) {
        console.log(err);
        res.status(500); //return a Internal Server Error (500)
    }

    var u = req.query.user;

    if (u == null) {
        u = "tim";
    }
    console.log(u)

    con.query('SELECT Subsaiddits.*\
					FROM Accounts, Subscribers, Subsaiddits\
					WHERE Accounts.user = ?\
					AND Accounts.user = Subscribers.user \
					AND Subscribers.subsaiddit = Subsaiddits.title;', [u],

        function(err, rows) {

            if (err) {
                console.log(err);
                res.status(500).end();
            }

            if (rows != null) {
                console.log(rows);
                console.log(rows.length);
                res.status(200).send(JSON.stringify(rows));
            } else {
                res.status(500).end();
            }
        }
    );

});

//------ Queasdfgry Route -------
router.route("/query")

.post(function(req, res, err) {


    var q = req.body.query.normalize();
    console.log("query string: " + JSON.stringify(q))


    if (q == null || q == "" || q == undefined) {
        q = "SELECT * FROM Accounts";
    }

    con.query(q,

        function(error, rows) {

            if (error) {
                console.log("error in query" + error);
                return res.status(500).send(error.message)
            };

            if (rows != null) {
                console.log(rows);
                console.log(rows.length);
                res.status(200).send(JSON.stringify(rows));
            }
        }
    );

});



//------ DEFAULT FRONT PAGE Route -------
router.route("/top")

.get(function(req, res, err) {

    //catch error in request
    if (err) {
        console.log(err);
        res.status(500); //return a Internal Server Error (500)
    }


    con.query('SELECT Posts.*, (Posts.upvotes - Posts.downvotes) AS rating\
					FROM Posts \
					JOIN\
					(SELECT title FROM Subsaiddits WHERE def = 1) Defaults\
					ON Posts.subsaiddit = Defaults.title\
					ORDER BY rating DESC\
					LIMIT 10;',


        function(err, rows) {

            if (err) {
                console.log(err);
                res.status(500).end();
            }

            if (rows != null) {
                console.log(rows);
                console.log(rows.length);
                res.status(200).send(JSON.stringify(rows));
            } else {
                res.status(500).end();
            }
        }
    );

});




//returns a random hex value
function randomValueHex(len) {
    return crypto.randomBytes(Math.ceil(len / 2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, len); // return required number of characters
}


//export the router, so it can be imported in the main server.js file
module.exports = router;