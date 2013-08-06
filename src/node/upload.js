var formidable = require('formidable');
var util = require('util');

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
        res.send(files.file.path, 200);
    });

    return;
}

function delayedEnsureAuthentication(request, response, next) {
    if (!request.user) {
        request.delayedStream.resume();
        return response.send(401);
    }

    return next();
}

routing.push(function(app) {
    app.post('/api/upload/uploadFile', delayedEnsureAuthentication, upload_parseUpload);
});