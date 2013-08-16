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

function upload_parseUpload (req, res){
    var form = new formidable.IncomingForm();

    form.uploadDir = './app/img/';
    form.keepExtensions = true;

    form.on('error', function(err) {
        console.log(err);
    });

    req.delayedStream.resume();

    form.parse(req.delayedStream.source, function(err, fields, files) {
        if (err) {
            console.log("Error: " + err);
            return res.send(500);
        }
        return res.send(files.file.path, 200);
    });

    return;
}

function delayedEnsureAuthentication(request, response, next) {
    if (!request.user) {
        request.delayedStream.resume();
        return response.send("Must be logged in.", 401);
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
    app.post('/api/upload/article/uploadFile', delayedEnsureAuthentication, canUploadArticlePicture, upload_parseUpload);
    app.post('/api/upload/profile/uploadFile', delayedEnsureAuthentication, canUploadProfilePicture, upload_parseUpload);
});