var port = 1337;

var collections = [];
var routing = [];

var express = require('express');
var fs = require('fs');
var DelayedStream = require('delayed-stream');
var http = require('http');

var app = express();

app.use(express.static(__dirname + '/app'));
app.use(express.cookieParser());
app.use(function(req,res,next){
    console.log("Content type: %s", req.get('content-type'));
    if(!req.get('content-type') || req.get('content-type').indexOf('multipart/form-data') == -1) return next();

    req.delayedStream = DelayedStream.create(req);

    return next();
});
app.use(express.session({ secret: "keyboard cat" }));
app.use(express.json());
app.use(express.urlencoded());