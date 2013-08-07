
collections.push(function(err, db) {
    if (!err) {
        console.log("Connected to test 1!");
        db.collection('articles', {strict: true}, function(err, collection) {
            if (err) {
                console.log("The articles collection doesn't exist.  Creating it now.");
                db_connector.createCollection('articles', {strict: true}, function(err, collection) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    }
});

function articles_clearDatabase(request, response) {
    db_connector.collection('articles', function(err, articles) {
        console.log("removing");
        articles.remove();
        response.send(200);
    });
}

//new post
function articles_create(request, response) {
    var d = new Date();
    db_connector.collection('articles', function(err, collection) {
        if(err) {
            console.log("OOOOOO");
        }
        collection.insert({"uid": request.body.uid, "name": request.body.name, "article": request.body.article, "title":request.body.title, "img": request.body.img, "date": d.getTime() }, function(err, data){
            if (err) {
                response.send("Article already exists!!!", 401);
            }
            else {
                console.log("Data added as " + data);
                response.send(data);
            }
        });
    });
}

//delete post

//update post

//get
function articles_get(request, response) {
    db_connector.collection('articles', function(err, collection) {
        collection.find({"_id": request.body._id}, {safe: true}, function(err, data){
            if (err) {
                response.send("Article already exists!!!", 401);
            }
            else {
                console.log("Data added as " + data);
                response.send(data[0]);
            }
        });
    });
}

//getAll
function articles_getAll(request, response) {
    db_connector.collection('articles', function(err, collection) {
        collection.find({"uid": request.body.uid }).toArray(function(err, data){
            if (err) {
                response.send("No articles found", 401);
            }
            else {
              //  console.log(data);
                response.send(data);
            }
        });
    });
}

function articles_getInOrder(request, response) {
    var count = parseInt(request.params.count);
    var page = parseInt(request.params.page);

    if (!count || count < 1) {
        count = 1;
    }
    else if (count > 15) {
        count = 15;
    }

    if (!page || page < 1) {
        page = 1;
    }

    db_connector.collection('articles', function(err, collection) {
        collection.find({}).limit(count).sort({'date': -1}).skip((page - 1) * count).toArray(function(err, data){
            if (err) {
                response.send("No articles found", 401);
            }
            else {
               // console.log(data);
                response.send(data);
            }
        });
    });
}

function hasPostPermission(request, response, next) {
    if (!request.user.canCreatePosts) { return response.send("User does not have permission to create new articles.", 401); }

    return next();
}

/* ALL DIS STUFF BE COOL */
routing.push(function(app) {
    app.post('/api/articles/create', ensureAuthentication, hasPostPermission, articles_create);
    app.get('/api/articles/get', articles_get);
    app.get('/api/articles/:page/:count', articles_getInOrder);
    app.post('/api/articles/getAll', articles_getAll);
    app.post('/api/articles/clear', articles_clearDatabase);
});