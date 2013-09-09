var mongodb = require('mongodb'),
	mongoserver = new mongodb.Server('localhost', mongodb.Connection.DEFAULT_PORT, {'auto-reconnect': true}),
    ObjectID = require('mongodb').ObjectID,
	db_connector = new mongodb.Db('test1', mongoserver, {'safe': false, 'strict': true});
	
db_connector.open(function(err, db) {
	for (var i = 0; i < collections.length; i++) {
		collections[i](err, db);
	}
});