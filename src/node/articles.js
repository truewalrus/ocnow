function canCreateArticle(userRank) { users_hasPermission(userRank, RANK_POSTER) };
function canPublishArticle(userRank) { users_hasPermission(userRank, RANK_ADMIN) };

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
    console.log("User with rank %d attempting to create article.", request.user.rank);

    if (!canCreateArticle(request.user.rank)) { return response.send("User does not have permission to create new articles.", 401) };

    var d = new Date();

    // If the user has permission to publish articles, and the article is requested to be published, then set published flag to true
    var published = (canPublishArticle(request.user.rank) && request.body.published == true);

    db_connector.collection('articles', function(err, collection) {
        collection.insert({"uid": request.body.uid, "name": request.body.name, "article": request.body.article, "title":request.body.title, "img": request.body.img, "date": d.getTime(), "published": published, "commentCount":0 }, function(err, data){
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

function articles_addComment(articleId){
    db_connector.collection('articles', function(err, collection) {
        collection.update({'_id': ObjectID(articleId)}, {$inc:{"commentCount":1}});
    });
}
function articles_removeComment(articleId){
    db_connector.collection('articles', function(err, collection) {
        collection.update({'_id': ObjectID(articleId)}, {$inc:{"commentCount":-1}});
    });
}

//delete post

//update post

//get
function articles_get(request, response) {
    db_connector.collection('articles', function(err, collection) {
        collection.find({"_id": ObjectID(request.params._id)}).toArray(function(err, data){
            if (err) {
                response.send("Article already exists!!!", 401);
            }
            else {
                console.log("Data sent ");
                //console.log(data);
                response.send(data[0]);
            }
        });
    });
}

//getAll
function articles_getAll(request, response) {
    db_connector.collection('articles', function(err, collection) {
        collection.find({"uid": request.params.uid }).sort({'date': -1}).toArray(function(err, data){
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

    // Ensure that count exists and is within the bounds of 1 to 15, inclusive.
    if (!count || count < 1) {
        count = 1;
    }
    else if (count > 15) {
        count = 15;
    }

    // Ensure that page exists and is a positive number.
    if (!page || page < 1) {
        page = 1;
    }

    db_connector.collection('articles', function(err, collection) {
        collection.find({"published": true}).limit(count).sort({'date': -1}).skip((page - 1) * count).toArray(function(err, data){
            if (err) {
                response.send("Server database error.", 500);
            }
            else {
                response.send(data);
            }
        });
    });
}

function articles_search(request, response) {
    db_connector.collection('articles', function(err, collection) {
        collection.find({$or: [{"title": {$regex: request.params.query, $options: "i"}}, {"tags": {$regex: request.params.query, $options: "i"}}]}).sort({'date': -1}).toArray(function(err, data){
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

/* ALL DIS STUFF BE COOL */
routing.push(function(app) {
    app.post('/api/articles/create', ensureAuthentication, articles_create);
    app.post('/api/articles/clear', ensureAuthentication, articles_clearDatabase);
    app.get('/api/articles/getAll/:uid', articles_getAll);
    app.get('/api/articles/get/:_id', articles_get);
    app.get('/api/articles/search/:query', articles_search);
    app.get('/api/articles/front/:page/:count', articles_getInOrder);
});