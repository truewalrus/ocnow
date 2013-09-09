var formidable = require('formidable');

function upload_parseForm(request, uploadPath, callback) {
    var form = new formidable.IncomingForm();

    form.uploadDir = uploadPath;
    form.keepExtensions = true;

    form.on('error', function(error) {
        console.error(error);
    });

    request.delayedStream.resume();

    form.parse(request.delayedStream.source, function(error, fields, files) {
        if (error) { return callback(error); }

        return callback(null, { body: fields, fileName: files.file.name });
    });

    return;
}

function upload_parseUpload (request, response, next){
    var form = new formidable.IncomingForm();

    form.uploadDir = request.body.uploadDir;
    console.log(request.body.uploadDir);
    form.keepExtensions = true;

    form.on('error', function(err) {
        console.log(err);
    });

    request.delayedStream.resume();

    form.parse(request.delayedStream.source, function(err, fields, files) {
        if (err) {
            console.log("Error: " + err);
            return response.send(500, { error: 'Database error occurred.' });
        }

        for (var attr in fields) {
            request.body[attr] = fields[attr];
        }

        if (files.file) {
            request.body.img = files.file.path.substring(files.file.path.lastIndexOf('\\') + 1);
        }

        return next();
    });
}

function delayedEnsureAuthentication(request, response, next) {
    if (!request.user) {
        request.delayedStream.resume();
        return response.send(401, { error: 'Article updated.' });
    }

    return next();
}

function canUploadArticlePicture (request, response, next) {
    if (!canCreateArticle(request.user.rank)) {
        request.delayedStream.resume();
        return response.send("User does not have permission to create articles.", 401);
    }

    console.log("Uploading article picture.");

    return next();
}

function canUploadProfilePicture (request, response, next) {
    if (request.body._id != request.user._id && !canUpdateUser(request.user.rank)) {
        request.delayedStream.resume();
        return response.send("User does not have permission to edit this user.", 401);
    }

    console.log("Uploading profile picture.");

    return next();
}

routing.push(function(app) {
    app.post('/api/user/update/:_id', delayedEnsureAuthentication,
        function(req, res, next) { req.body.uploadDir = './app/img/'; return next(); },
        function(request, response, next) {
            if (request.params._id != request.user._id && !canUpdateUser(request.user.rank)) { return response.send(401, { error: "User does not have permission to update this user." }); }

            return next();
        },
        upload_parseUpload, users_update_setup, users_update);

    app.post('/api/articles/update/:_id', delayedEnsureAuthentication,
        function(req, res, next) { req.body.uploadDir = './app/img/'; return next(); },
        function(request, response, next) {
            if (!canUpdateArticle(request.user.rank)) {
                db_connector.collection('articles', function(error, articles) {
                    articles.findOne({ "_id": ObjectID(request.params._id ) }, function(error, article) {
                        if (article.uid != request.user._id) {
                            return response.send(401, { error: "User does not have permission to update this article." });
                        }
                        else {
                            return next();
                        }
                    });
                });
            }
            else {
                return next();
            }
        },
        upload_parseUpload, articles_update_setup, articles_update);

    app.post('/api/articles/create', delayedEnsureAuthentication,
        function(req, res, next) { req.body.uploadDir = './app/img/'; return next(); },
        function(request, response, next) {
            if (!canCreateArticle(request.user.rank)) { return response.send(401, { error: "User does not have permission to create articles." }); }

            return next();
        },
        upload_parseUpload, articles_create);
//    app.post('/api/upload/article/uploadFile', delayedEnsureAuthentication, canUploadArticlePicture, upload_parseUpload);
//    app.post('/api/upload/profile/uploadFile', delayedEnsureAuthentication, canUploadProfilePicture, upload_parseUpload);
});