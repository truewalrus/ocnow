var mongodb = require('mongodb'),
    ObjectID = require('mongodb').ObjectID

if (process.env.MONGOLAB_URI){
   console.log("AM I IN HERE IS THIS GONNA WORK LET IF YOU COULD LET MKE KNOW THAT'D BE GREAT");
   db_connector = new mongodb.Db('ocnow', new mongodb.Server(process.env.MONGOLAB_URI, mongodb.Connection.DEFAULT_PORT, {'auto-reconnect': true}), {'safe':false, 'strict':true});
}
else{
	var mongoserver = new mongodb.Server('localhost', mongodb.Connection.DEFAULT_PORT, {'auto-reconnect': true}),
	db_connector = new mongodb.Db('test1', mongoserver, {'safe': false, 'strict': true});
}
db_connector.open(function(err, db) {
	for (var i = 0; i < collections.length; i++) {
		collections[i](err, db);
	}
});