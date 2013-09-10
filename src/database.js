var mongodb = require('mongodb'),
    ObjectID = require('mongodb').ObjectID

if (process.env.MONGOLAB_URI){
   console.log("AM I IN HERE IS THIS GONNA WORK LET IF YOU COULD LET MKE KNOW THAT'D BE GREAT");
   //db_connector = new mongodb.Db('ocnow', new mongodb.Server(process.env.MONGOLAB_URI, mongodb.Connection.DEFAULT_PORT, {'auto-reconnect': true}), {'safe':false, 'strict':true});

   mongodb.connect(process.env.MONGOLAB_URI, {}, dbConnectCallback);
}
else{
	var mongoserver = new mongodb.Server('localhost', mongodb.Connection.DEFAULT_PORT, {'auto-reconnect': true}),
	db_connector = new mongodb.Db('test1', mongoserver, {'safe': false, 'strict': true});
    dbConnectCallback(null, db_connector, true);
}


function dbConnectCallback( error, db, local )
{
    if (local) {
        db.open(function(err, db) {
            for (var i = 0; i < collections.length; i++) {
                collections[i](err, db);
            }
        });
    }
    else {
        db_connector = db;

        for (var i = 0; i < collections.length; i++) {
            collections[i](error, db);
        }
    }
};