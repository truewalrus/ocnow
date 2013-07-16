var port = 1337;

var collections = [];
var routing = [];

var express = require('express');
var fs = require('fs');
var http = require('http');

var app = express();

app.use(express.static(__dirname + '/app'));
app.use(express.cookieParser());
app.use(express.session({ secret: "keyboard cat" }));
app.use(express.bodyParser());