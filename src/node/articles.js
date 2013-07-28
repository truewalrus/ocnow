
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
    db_connector.collection('articles', function(err, collection) {
        if(err) {
            console.log("OOOOOO");
        }
        collection.insert({"_uid": request.body._uid, "article": request.body.article, "title":request.body.title, "date": d.getTime() }, function(err, data){
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
        collection.find({"_uid": request.body._uid }).toArray(function(err, data){
            if (err) {
                response.send("No articles found", 401);
            }
            else {
                console.log(data);
                response.send(data);
            }
        });
    });
}


/* ALL DIS STUFF BE COOL */
routing.push(function(app) {
    app.post('/api/articles/create', articles_create);
    app.get('/api/articles/get', articles_get);
    app.post('/api/articles/getAll', articles_getAll);
    app.post('/api/articles/clear', articles_clearDatabase);
});