collections.push(function(err, db) {
    if (!err) {
        console.log("Connected to test 1!");
        db.collection('comments', {strict: true}, function(err, collection) {
            if (err) {
                console.log("The comments collection doesn't exist.  Creating it now.");
                db_connector.createCollection('comments', {strict: true}, function(err, collection) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    }
});

function comments_getCommentCount(request, response) {
    db_connector.collection('comments', function(err, comments) {
        comments.count({ "articleId": request.query.id }, function(error, count) {
            if (error) {
                return response.send(500, "Database error occurred while processing the request.");
            }

            return response.send(200, { count: count });
        });
    });
}

function comments_getComments(request, response){
    db_connector.collection('comments', function(err, comments) {
        comments.find({"articleId": request.params.articleId}).sort({'date': -1}).toArray(function(err, data){
            if(err){
                response.send(500);
            }
            else
            {
                var userIdTable = [];
                for(var i = 0; i < data.length; i++){
                    userIdTable.push(ObjectID(data[i].uId));
                }

                users_findByIds(userIdTable, function (userInfo){
                    if (userInfo)
                    {
                        var hashedUser = {};
                        for (var i = 0; i < userInfo.length; i++){
                            hashedUser[String(userInfo[i]._id)] = i;


                        }

                        for(var i = 0; i < data.length; i++){
                            var user = userInfo[hashedUser[data[i].uId]];


                            data[i].username = user.username;
                            data[i].img = user.img;
                        }
                    }


                    response.send(data);

                });

            }

        });

    });

}

function comments_addComment(request, response){
    var d = new Date();
    db_connector.collection('comments', function(err, comments) {
        comments.insert({'articleId': request.params.articleId, 'uId': request.body.uId, 'content': request.body.content, 'date': d.getTime()}, function(err, data){
            if(err){
                response.send(500);
            }
            else{
                console.log("Comment added as " + data);
                articles_addComment(request.params.articleId);
                response.send(200);
            }
        });
    });

}

function comments_flagComment(request, response){
    db_connector.collection('comments', function(err, comments) {
        comments.update({'_id': ObjectID(request.body._id)}, {$set: {'flagged': request.body.flagged}}, function(err, data){
            if(err){
                response.send(500);
            }
            else{
                response.send(200);
            }
        });
    });
}

function comments_getFlagged(request, response){
    db_connector.collection('comments', function(err, comments) {
        comments.find({'flagged': true}).toArray(function(err, data) {
            if(err){
                response.send(500);
            }
            else
            {
                var userIdTable = [];
                for(var i = 0; i < data.length; i++){
                    userIdTable.push(ObjectID(data[i].uId));
                }

                users_findByIds(userIdTable, function (userInfo){
                    if (userInfo)
                    {
                        var hashedUser = {};
                        for (var i = 0; i < userInfo.length; i++){
                            hashedUser[String(userInfo[i]._id)] = i;


                        }

                        for(var i = 0; i < data.length; i++){
                            var user = userInfo[hashedUser[data[i].uId]];


                            data[i].username = user.username;
                            data[i].img = user.img;
                        }
                    }


                    response.send(data);

                });

            }
        });
    });
}

function comments_removeComment(request, response){
    db_connector.collection('comments', function(err, comments) {
        comments.remove({'_id':  ObjectID(request.body._id)}, function(err) {
            if (err) {
                response.send({'message':'Failed to delete comment'}, 401);
            }
            else {
                articles_removeComment(request.body.articleId);
                response.send(200);
            }
        });
    });
}


routing.push(function(app) {
    app.get('/api/comments/get/:articleId', comments_getComments);
    app.get('/api/comments/getFlagged', comments_getFlagged);
    app.get('/api/comments/count', comments_getCommentCount);
    app.post('/api/comments/add/:articleId', comments_addComment);
    app.post('/api/comments/flagComment', ensureAuthentication, comments_flagComment);
    app.post('/api/comments/removeComment', ensureAuthentication, comments_removeComment);
});