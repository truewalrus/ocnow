collections.push(function(err, db) {
    if (!err) {
        console.log("Connected to test 1!");
        db.collection('tags', {strict: true}, function(err, collection) {
            if (err) {
                console.log("The tags collection doesn't exist.  Creating it now.");
                db_connector.createCollection('tags', {strict: true}, function(err, collection) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            db.ensureIndex('tags', {'id': 1}, {unique: true, dropDups: true}, function() {});

        });
    }

});

function tags_addTag(request, response){
    db_connector.collection('tags', function(err, tags) {
        tags.insert({ "tag": request.body.tag, "id" : request.body.tag.toUpperCase() }, {safe: true}, function(error, data) {
            if (error) {
                return response.send(401, "Tag already exists.");
            }
            else{
                console.log("tag added");
                return response.send(200, data[0]);
            }


        });
    });
}

function tags_deleteTag(request, response){
    db_connector.collection('tags', function(err, tags) {
        tags.remove({'_id':  ObjectID(request.body._id)}, function(err) {
            if (err) {
                response.send({'message':'Failed to delete tag'}, 401);
            }
            else {
               response.send(200);
            }
        });
    });
}

function tags_get(request, response){
    db_connector.collection('tags', function(err, tags){
        tags.find().sort({'id':1}).toArray(function(err, items){
            response.send(items);
        });
    });
}



routing.push(function(app) {
    app.post('/api/tags/addTag', ensureAuthentication, tags_addTag);
    app.get('/api/tags/get', tags_get);
});