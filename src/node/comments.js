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


routing.push(function(app) {
    app.get('/api/comments/:articleId', comments_getComments);
    app.post('/api/comments/:articleId', comments_addComment);
});