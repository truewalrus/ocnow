
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
        collection.insert({"uid": request.body.uid, "name": request.body.name, "article": request.body.article, "title":request.body.title, "img": request.body.img, "date": d.getTime(), "commentCount":0 }, function(err, data){
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

function articles_search(request, response) {
    db_connector.collection('articles', function(err, collection) {
        collection.find({$or: [{"title": {$regex: request.params.query, $options: "i"}}, {"tags": {$regex: request.params.query, $options: "i"}}]}).toArray(function(err, data){
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

function hasPostPermission(request, response, next) {
    if (!request.user.canCreatePosts) { return response.send("User does not have permission to create new articles.", 401); }

    return next();
}

/* ALL DIS STUFF BE COOL */
routing.push(function(app) {
    app.post('/api/articles/create', ensureAuthentication, hasPostPermission, articles_create);
    app.post('/api/articles/getAll', articles_getAll);
    app.post('/api/articles/clear', articles_clearDatabase);
    app.get('/api/articles/get/:_id', articles_get);
    app.get('/api/articles/search/:query', articles_search);
    app.get('/api/articles/front/:page/:count', articles_getInOrder);

});