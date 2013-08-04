var formidable = require('formidable');
var util = require('util');

function upload_parseUpload (req, res){
    var form = new formidable.IncomingForm();

    form.uploadDir = __dirname + '/app/img/';
    form.keepExtensions = true;

    form.on('error', function(err) {
        console.log(err);
    });

    form.parse(req, function(err, fields, files) {
        if (err) {
            console.log("Error: " + err);
            return res.send(500);
        }
        res.send(files.file.path, 200);
    });

    return;
}

routing.push(function(app) {
    app.post('/api/upload/uploadFile', upload_parseUpload);

});