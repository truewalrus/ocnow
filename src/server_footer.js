for (var i = 0; i < routing.length; i++) {
	routing[i](app);
}

app.get('/favicon.ico', function(request, response) {
	response.send(404);
});

app.get('*', function(request, response) {
	console.log('Sending index.html (%s)', request.url);
    response.sendfile('app/index.html');
});

app.listen(port);
console.log('Listening on port %d.', port);