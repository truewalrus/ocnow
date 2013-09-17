var AWS = require('aws-sdk');

AWS.config.loadFromPath('./aws-config.json');

var s3 = new AWS.S3();
var s3bucket = 'trurektestbucket';