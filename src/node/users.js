var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');

var RANK_SITEADMIN = 1;
var RANK_ADMIN = 2;
var RANK_POSTER = 3;
var RANK_COMMENTER = 4;

function canCreateAdmin(userRank) { return users_hasPermission(userRank, RANK_SITEADMIN) };
function canCreatePoster(userRank) { return users_hasPermission(userRank, RANK_ADMIN) };
function canUpdateUser(userRank) { return users_hasPermission(userRank, RANK_ADMIN) };

function users_hasPermission(userRank, permission) {
    console.log(userRank + " <= " + permission);
    return (userRank <= permission);
}

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

function users_findByUsername(username, password, fn) {
    console.log("Finding by Username");

    db_connector.collection('users', function(err, collection) {
        collection.find({'id': username.toUpperCase()}).toArray(function(err, items) {
            if (err) { return fn(err); }

            if (items.length > 0) {
                if (!items[0].password) {
                    var salt = bcrypt.genSaltSync();
                    items[0].password = bcrypt.hashSync(password, salt);

                    collection.update({'username': username}, {$set: {'password': items[0].password}}, function(err) {
                        console.log(err);
                    });
                }

                return fn(null, items[0]);
            }
            else {
                return fn(null, null);
            }
        });
    });
}

function users_parseName(user) {
    var name = ((user.fName || ' ') + ' ' + (user.lName || ' ')).trim();

    if (!name || name === '') {
        return user.username;
    }

    return name;
}

// 2. Get Requests

// 2.1 Main Index / Default Handler

// 2.3 'api/user' Handler

//MAKE SURE TO CHANGE TO USE ADMIN RANK AT SOME POINT
function users_allUsers(request, response) {
    if (!canUpdateUser(request.user.rank)) { return response.send(401); }

    db_connector.collection('users', function(err, collection) {
        collection.find({'rank': {$gt: request.user.rank}}).sort({'id':1}).toArray(function(err, items) {
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
    if (request.body._id != request.user._id && !canUpdateUser(request.user.rank)) { return response.send("User does not have permission to update this user.", 401); }

    db_connector.collection('users', function(err, collection) {
//        collection.remove({'_id':  ObjectID(request.body._id)}, function(err) {
//            if (err) {
//                console.log('error here: ' + err);
//                response.send({'message':'Failed to delete user'}, 401);
//            }
//            else {
//                if (request.body._id == request.user._id) { request.logout(); }
//
//                response.send(200);
//            }
//        });

            collection.findAndModify({'_id': ObjectID(request.body._id)}, [], {}, {remove: true}, function(err, user) {
                if (err) {
                    return response.send(500);
                }
                else {
                    if (request.body._id == request.user._id) { request.logout(); }

                    if (user.img) {
                        s3.deleteObject({Bucket: s3bucket, Key: user.img}, function(err, data) {
                            if (err) {
                                console.log("Error deleting old profile image (users_userDelete).");
                            }
                        });
                    }

                    return response.send(200);
                }
            });
        });
}

function users_createUser(request, response){

    var salt = bcrypt.genSaltSync();
    var password =  bcrypt.hashSync(request.body.password, salt);

    var rank = request.body.rank ? parseInt(request.body.rank) : RANK_COMMENTER;

    if ((rank == RANK_POSTER && !canCreatePoster(request.user.rank)) || (rank == RANK_ADMIN && !canCreateAdmin(request.user.rank))) {
        rank = RANK_COMMENTER;
    }

    db_connector.collection('users', function(err, collection){
        collection.insert({'username': request.body.username, 'password': password, 'id': request.body.username.toUpperCase(), 'rank': rank, 'fName': request.body.fName, 'lName':request.body.lName, 'email': request.body.email}, {safe: true}, function(err, data){
            if (err) {
                response.send("Username already exists.", 401);
            }
            else {
                console.log("Data added as " + data[0].id);
                response.send(data[0]);
            }
        });
    });
}

function users_changePassword(request, response){


    if(request.body._id != request.user._id){
        if (!canUpdateUser(request.user.rank)){
            return response.send("User does not have permission to update this user.", 401);
        }
    }
    else{
        if(!bcrypt.compareSync(request.body.password, request.user.password)){
            return response.send("Incorrect password, ask an admin for assistance.", 401);
        }
    }

    var salt = bcrypt.genSaltSync();
    var password = bcrypt.hashSync(request.body.newPassword, salt);

    db_connector.collection('users', function (err, collection){
        collection.update({'_id': ObjectID(request.body._id)}, {$set:{'password':password}}, function(err, data){
            if (err){
                response.send("Failure to update data", 401);
            }
            else{
                response.send(200);
            }
        });
    });
}

function users_checkSession(request,response){
    response.send(users_cleanUserObject(request.user));
}

function users_updateUser(request,response){
    if (request.body._id != request.user._id && !canUpdateUser(request.user.rank)) { return response.send("User does not have permission to update this user.", 401); }

    db_connector.collection('users', function (err, collection){
        var updateFields = {};
        updateFields["fName"] = request.body.fName || '';
        updateFields["lName"] = request.body.lName || '';
        if (request.body.displayName != '')
        {
            updateFields["displayName"] = request.body.displayName;
        }
        if (request.body.img != '')
        {
            updateFields["img"] = request.body.img;
        }

        collection.update({'_id': ObjectID(request.body._id)}, {$set:updateFields}, function(err, data){
            if (err){
                response.send("Failure to update data", 401);
            }
            else{
                collection.find({'_id': ObjectID(request.body._id)}).toArray(function(err, user) {
                    if (err) { return console.error("(users.js) Error searching for user by _id"); }

                    db_connector.collection('articles', function(err, articles) {
                        if (err) { return console.error("(users.js) Error updating name fields of articles."); }

                        articles.update({'uid': request.body._id}, {$set: {'name': users_parseName(user[0])}}, { multi: true }, function(err, count) {
                            console.log(err);
                        });
                    });
                });

             //   console.log("Success: ");
                var userInfo = users_cleanUserObject(request.user);
                for (var attr in request.body){
                    userInfo[attr] = request.body[attr];
                }
                response.send(userInfo);
            }
        });
    });
}

function users_findByIds(id, fn) {
    db_connector.collection('users', function(err, collection) {
        if (err) { return console.log(err); }
        collection.find({'_id': {$in: id}}).toArray(function(err, items) {
            if (err) { return console.error(err); }
            return fn(items);
        });
    });

   // console.log("outside " + users);

   // return users;
}

function users_cleanUserObject(user){
    var cleanUser = {};

    cleanUser._id = user._id;
    cleanUser.username = user.username;
    cleanUser.fName = user.fName;
    cleanUser.lName = user.lName;
    cleanUser.img = user.img;
    cleanUser.displayName = user.displayName;
    cleanUser.rank = user.rank;
    cleanUser.email = user.email;

    return cleanUser;
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
        users_findByUsername(username, password, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false, { errUser: true }); }
            if (!bcrypt.compareSync(password, user.password)) { return done(null, false, { errPassword: true }); }

            return done(null, user);
        });
    }
));

//Middleware Functions

//ensureAuthentication: confirm a user is logged in
function ensureAuthentication(request, response, next) {
    if (!request.user) { return response.send(401, "Must be logged in."); }

    return next();
}

function users_findUserById(request, response) {
    db_connector.collection('users', function(error, users) {
        if (error) { return console.error(error); }

        users.findOne({'_id': ObjectID(request.params._id)}, function(error, matched) {
            if (error) { return console.error(error); }

            if (matched) {
                return response.send(200, { user: users_cleanUserObject(matched) });
            }
            else {
                return response.send(404, "User not found.");
            }
        });
    });
}

function users_update_setup(request, response, next) {
    var updatedFields = {};
    updatedFields.fName = request.body.fName;
    updatedFields.lName = request.body.lName;

    if (request.body.img) {
        updatedFields.img = request.body.img;

        request.updates = updatedFields;

        db_connector.collection('users', function (err, users){
            users.findOne({ '_id': ObjectID(request.params._id) }, function(error, user) {
                if (user.img) {
                    console.log("Deleting image", user.img);

                    s3.deleteObject({Bucket: s3bucket, Key: user.img}, function(err, data) {
                        if (err) {
                            console.log("Error deleting old profile image (users_update_setup).");
                        }
                    });
                }

                return next();
            });
        });
    }
    else {
        request.updates = updatedFields;

        return next();
    }
}

function users_update(request, response) {
    db_connector.collection('users', function (err, users){
        users.update({ '_id': ObjectID(request.params._id) }, { $set: request.updates }, function(error, data){
            if (error) {
                response.send(500, { error: "Database error occurred while processing request." });
            }
            else {
                users.findOne({'_id': ObjectID(request.params._id)}, function(err, user) {
                    if (err) { return console.error("(users.js) Error searching for user by _id"); }

                    db_connector.collection('articles', function(err, articles) {
                        if (err) { return console.error("(users.js) Error updating name fields of articles."); }

                        articles.update({'uid': request.params._id}, {$set: {'name': users_parseName(user)}}, { multi: true }, function(err, count) {
                            console.log(err);
                        });
                    });
                });

                //   console.log("Success: ");
                var userInfo = users_cleanUserObject(request.user);
                for (var attr in request.body){
                    userInfo[attr] = request.body[attr];
                }
                response.send(200, userInfo);
            }
        });
    });
}

function users_saveEmail(request, response){

    if(request.body._id != request.user._id){
        if (!canUpdateUser(request.user.rank)){
            return response.send("User does not have permission to update this user.", 401);
        }
    }

    db_connector.collection('users', function(error, users) {
        users.findAndModify( { _id: ObjectID(request.body._id) }, [], { $set:{"email": request.body.email} }, {new:true}, function(error, data) {
            if (error) { return response.send(401, error) }
            else{
                var userInfo = users_cleanUserObject(request.user);
                userInfo.email = request.body.email;
                response.send(200, userInfo);
            }
        });
    });
}

/* ALL DIS STUFF BE COOL */
routing.push(function(app) {
	app.get('/api/user', ensureAuthentication, users_userInfo);

	app.get('/api/user/fname/:fname', users_findUserByFname);

	app.get('/api/user/age/:age', users_findUserByAge);

    app.get('/api/user/id/:_id', users_findUserById);

	app.get('/api/user/logout', users_userLogout);

    app.get('/api/user/allUsers', ensureAuthentication, users_allUsers);

//    app.get('/api/user/clear', clearDatabase);


	app.post('/api/user/login', function(request, response, next) {
			passport.authenticate('local', function(err, user, info) {
				if (err) {;return next(err); }
				if (!user) {
					return response.send(401, 'Incorrect Username or Password.');
				}

				request.login(user, function(err) {
					if (err) { return next(err); }
					console.log("User logged in");
					return response.send(200, { 'username': user.username, '_id': user._id });
				});
			})(request, response, next);
	});

	app.get('/api/user/checkSession', ensureAuthentication, users_checkSession);

	app.post('/api/user/create', captcha_verify, users_createUser);

//    app.post('/api/user/updateUser', ensureAuthentication, users_updateUser);

    app.post('/api/user/delete', ensureAuthentication, users_userDelete);

    app.post('/api/user/changePassword', ensureAuthentication, users_changePassword);

    app.post('/api/user/saveEmail', ensureAuthentication, users_saveEmail);
});