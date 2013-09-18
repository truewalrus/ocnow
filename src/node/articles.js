function canCreateArticle(userRank) { return users_hasPermission(userRank, RANK_POSTER) };
function canUpdateArticle(userRank) { return users_hasPermission(userRank, RANK_ADMIN) };
function canPublishArticle(userRank) { return users_hasPermission(userRank, RANK_ADMIN) };
function isOwnerOf(aUid, uid) {return uid == aUid};

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

    console.log(request.body);

    db_connector.collection('articles', function(err, collection) {
        collection.insert({"uid": String(request.user._id), "name": users_parseName(request.user), "article": request.body.article, "title":request.body.title, "img": request.body.img, "date": d.getTime(), "published": published, "tags": request.body.tags, "commentCount":0 }, function(err, data){
            if (err) {
                response.send("Article already exists!!!", 401);
            }
            else {
                console.log("Data added as ", data[0]);
                response.send(200, { article: data[0] });
            }
        });
    });
}

function articles_addComment(articleId){
    db_connector.collection('articles', function(err, collection) {
        collection.update({'_id': ObjectID(articleId)}, {$inc:{"commentCount":1}}, function(err,count){
            console.log(err);
        });
    });
}
function articles_removeComment(articleId){
    db_connector.collection('articles', function(err, collection) {
        collection.update({'_id': ObjectID(articleId)}, {$inc:{"commentCount":-1}}, function(err,count){
            console.log(err);
        });
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
    var count = parseInt(request.query.count);
    var page = parseInt(request.query.page);
    var query = {};

    console.log("Sending %d articles from page %d", count, page);

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

    query.published = true;
    if (request.query.tag) { query.tags = new RegExp('.*' + request.query.tag + '.*', 'i'); }

    db_connector.collection('articles', function(err, collection) {
        var info = {};

        collection.find(query).limit(count).sort({'date': -1}).skip((page - 1) * count, function(err, cursor){
            if (err) {
                response.send("Server database error.", 500);
            }
            else {
                cursor.count(function(err, total) {
                    info.pages = Math.ceil(total / count);

                    cursor.toArray(function(err, data) {
                        info.articles = data;

                        response.send(200, info);
                    });
                })
            }
        });
    });
}

function articles_getUnpublished(request, response) {
    if(canPublishArticle(request.user.rank) ){
        db_connector.collection('articles', function(err, collection) {
            collection.find({"published": false }).sort({'date': -1}).toArray(function(err, data){
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
    else{
        response.send(401);
    }
}

//function articles_publish(request, response){
//    if (canPublishArticle(request.user.rank)){
//        var d = new Date();
//        db_connector.collection('articles', function(err, collection) {
//            collection.update({"_id":ObjectID(request.body._id)}, {$set:{"date": d.getTime(), "published": true} }, function(err, data){
//                if (err) {
//                    response.send(500, "Database error occurred while processing request.");
//                }
//                else {
//                    response.send(200);
//                }
//            });
//        });
//    }
//    else{
//        response.send(401, "User does not have permission to publish articles.");
//    }
//}

function articles_publish(request, response){
    if (canPublishArticle(request.user.rank)) {
        var d = new Date();

        db_connector.collection('articles', function(err, collection) {
            collection.findAndModify({ "_id": ObjectID(request.body._id) }, [], { $set: { "date": d.getTime(), "published": true } }, { new: true }, function(err, data){
                if (err) {
                    response.send(500, "Database error occurred while processing request.");
                }
                else {
                    response.send(200, { article: data });
                }
            });
        });
    }
    else{
        response.send(401, "User does not have permission to publish articles.");
    }
}

function articles_unpublish(request, response){
    if (canPublishArticle(request.user.rank) || isOwnerOf(request.body.uid, request.user._id)) {
        db_connector.collection('articles', function(err, collection) {
            collection.findAndModify({ "_id": ObjectID(request.body._id) }, [], { $set: { "published": false } }, { new: true }, function(err, data){
                if (err) {
                    response.send(500, "Database error occurred while processing request.");
                }
                else {
                    response.send(200, { article: data });
                }
            });
        });
    }
    else{
        response.send(401, "User does not have permission to unpublish article.");
    }
}

function articles_search(request, response) {
    db_connector.collection('articles', function(err, collection) {
        collection.find({$or: [{"title": {$regex: request.params.query, $options: "i"}}, {"tags": {$regex: request.params.query, $options: "i"}}], published: true}).sort({'date': -1}).toArray(function(err, data){
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

function articles_update_setup(request, response, next) {
    var updatedFields = {};
    updatedFields.title = request.body.title;
    updatedFields.article = request.body.article;
    updatedFields.tags = request.body.tags;
    console.log(request.body);
    if (request.body.img) {
        updatedFields.img = request.body.img;

        request.updates = updatedFields;

        db_connector.collection('articles', function (err, articles){
            articles.findOne({ '_id': ObjectID(request.params._id) }, function(error, article) {
                if (article.img) {
                    console.log("Deleting article image");

                    s3.deleteObject({Bucket: s3bucket, Key: article.img}, function(err, data) {
                        if (err) {
                            console.log("Error deleting old article image (articles_update_setup).");
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

function articles_update(request, response) {
    db_connector.collection('articles', function (error, articles){
        var d = new Date();

        articles.update({ '_id': ObjectID(request.params._id) }, { $set: request.updates }, function(error, data){
            if (error) {
                response.send(500, { error: "Database error occurred while processing request." });
            }
            else {
                response.send(200, { message: 'Article updated.' });
            }
        });
    });
}


function articles_deleteImg(request,response,next){
    if(canUpdateArticle(request.user.rank)){
        db_connector.collection('articles', function(error, articles){
            articles.findOne({ '_id': ObjectID(request.params._id) }, function(error, article) {
                if (article.img) {
                    console.log("Deleting article image");
                    fs.unlink('app/img/' + article.img);
                }

                return next();
            });
        })
    }
    else{
        response.send(401, "Unauthorized.");
    }

}

function articles_delete(request, response){
    db_connector.collection('articles', function(error, articles){
        articles.remove({ '_id': ObjectID(request.params._id) }, function(error, data){
            if (error) {
                response.send(500, { error: "Database error occurred while processing request." });
            }
            else {
                response.send(200, { message: 'Article deleted.' });
            }
        });
    })
}

/* ALL DIS STUFF BE COOL */
routing.push(function(app) {
//    app.post('/api/articles/create', ensureAuthentication, articles_create);
    app.post('/api/articles/clear', ensureAuthentication, articles_clearDatabase);
    app.post('/api/articles/publish', ensureAuthentication, articles_publish);
    app.post('/api/articles/unpublish', ensureAuthentication, articles_unpublish);
    app.post('/api/articles/delete/:_id', ensureAuthentication, articles_deleteImg, comments_deleteAll, articles_delete);
    app.get('/api/articles/getAll/:uid', articles_getAll);
    app.get('/api/articles/get/:_id', articles_get);
    app.get('/api/articles/search/:query', articles_search);
    app.get('/api/articles/front', articles_getInOrder);
    app.get('/api/articles/getUnpublished', articles_getUnpublished);
});