var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

app.use(passport.initialize());
app.use(passport.session());

collections.push(function(err, db) {
	if (!err) {
		console.log("Connected to test 1!");
		db.collection('users', {strict: true}, function(err, collection) {
			if (err) {
				console.log("The users collection doesn't exist.  Creating it now.");
				db_connector.createCollection('users', {strict: true}, function(err, collection) {
					if (err) {
						console.log(err);
					}
				});
			}

            db.ensureIndex('users', {'id': 1}, {unique: true, dropDups: true}, function() {});
		});
	}
});

function users_findById(id, fn) {
    console.log("Finding by ID");
    db_connector.collection('users', function(err, collection) {
        collection.find({'_id': ObjectID(id)}).toArray(function(err, items) {
            if (err) { return fn(err); }

            if (items.length > 0) {
                return fn(null, items[0]);
            }
            else {
                return fn(new Error('User ' + id + ' does not exist'));
            }
        });
    });
}

function users_findByUsername(username, fn) {
    console.log("Finding by Username");

    db_connector.collection('users', function(err, collection) {
        collection.find({'username': username}).toArray(function(err, items) {
            if (err) { return fn(err); }

            if (items.length > 0) {
                return fn(null, items[0]);
            }
            else {
                return fn(null, null);
            }
        });
    });
}

// 2. Get Requests

// 2.1 Main Index / Default Handler

// 2.3 'api/user' Handler
function users_allUsers(request, response) {
    db_connector.collection('users', function(err, collection) {
        collection.find().toArray(function(err, items) {
            response.send(items);
        });
    });
}

// 2.4 'api/user/fname/:fname' Handler
function users_findUserByFname(request, response) {

    var fname = request.params.fname;

    db_connector.collection('users', function(err, collection) {
        collection.find({'fname': fname}).toArray(function(err, items) {
            response.send(items);
        });
    });
}

// 2.5 'api/user/age/:age' Handler
function users_findUserByAge(request, response) {

    var age = parseInt(request.params.age);

    db_connector.collection('users', function(err, collection) {
        collection.find({'age': age}).toArray(function(err, items) {
            response.send(items);
        });
    });
}


function users_userLogout(request, response) {
    /*	request.session.destroy(function(err){
     if (err) {
     response.send("Logout failed", 401);
     }
     else {
     response.send("Logout Successful", 200);
     }
     });*/

    request.logout();
    response.send(200);
}

function users_userInfo(request, response) {
    response.send(request.user);
}

function users_userDelete(request, response) {


    db_connector.collection('users', function(err, collection) {
        collection.remove({'id': request.user.id}, function(err) {
            if (err) {
                console.log('error here: ' + err);
                response.send({'message':'Failed to delete user'}, 401);
            }
            else {
                request.logout();
                response.send(200);
            }
        });
    });
}

function users_createUser(request, response){
    var salt = bcrypt.genSaltSync();
    var password =  bcrypt.hashSync(request.body.password, salt);
    db_connector.collection('users', function(err, collection){
        collection.insert({'username': request.body.username, 'password': password, 'id': request.body.username.toUpperCase()}, {safe: true}, function(err, data){
            if (err) {
                response.send("Username already exists!!!", 401);
            }
            else {
                console.log("Data added as " + data[0].id);
                response.send(data[0]);
            }
        });
    });
}

function users_checkSession(request,response){
    response.send(200);
}

function clearDatabase(request, response) {
	db_connector.collection('users', function(err, users) {
		console.log("removing");
		users.remove();
		response.send(200);
	});
}

passport.serializeUser(function(user, done) {
   done(null, user._id);
});

passport.deserializeUser(function(id, done) {
   users_findById(id, function(err, user) {
        done(err, user);
   });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log("Auth: ", username, password);
        users_findByUsername(username, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false, { errUser: true }); }
            if (!bcrypt.compareSync(password, user.password)) { return done(null, false, { errPassword: true }); }

            return done(null, user);
        });
    }
));

function ensureAuthentication(request, response, next) {
    if (!request.user) { return response.send(401); }

    return next();
}

/* ALL DIS STUFF BE COOL */
routing.push(function(app) {
	app.get('/api/user', ensureAuthentication, users_userInfo);

	app.get('/api/user/fname/:fname', users_findUserByFname);

	app.get('/api/user/age/:age', users_findUserByAge);

	app.get('/api/user/logout', users_userLogout);

	app.get('/api/user/delete', users_userDelete);

	app.get('/api/user/clear', clearDatabase);

	app.post('/api/user/login', function(request, response, next) {
			passport.authenticate('local', function(err, user, info) {
				if (err) { return next(err); }
				if (!user) {
					return response.send(401, info);
				}

				request.login(user, function(err) {
					if (err) { return next(err); }
					console.log("User logged in");
					return response.send(200, { 'username': user.username });
				});
			})(request, response, next);
	});

	app.get('/api/user/checkSession', ensureAuthentication, users_checkSession);

	app.post('/api/user/create', users_createUser);
});