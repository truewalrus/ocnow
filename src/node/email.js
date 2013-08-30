var nodemailer = require("nodemailer");

var smtp_options = {
    service: "Gmail",
    auth: {
        user: 'gorrum@gmail.com',
        pass: ''
    }
}

var transport = nodemailer.createTransport('SMTP', smtp_options);

function email_sendEmail(request, response){


    var userEmail = email_findByUsername(request.body.username, function(email){

        console.log(email);
        var mailOptions = {
            from: "me@tr.ee",
            to: email,
            subject: "Hello world!",
            text: "Plaintext body"
        }

        transport.sendMail(mailOptions, function (error, response){
            if (error){
                console.log(error);
                response.send(401, error);
            }else{
                console.log("Message sent: " + response.message);
                response.send(200, response.message);
            }
        });
    });



}

function email_findByUsername(username, fn) {
    db_connector.collection('users', function(err, collection) {
        collection.find({'id': username.toUpperCase()}).toArray(function(err, items) {
            if (err) { return fn(err); }

            if (items.length>0) {
                console.log(items);
                if(items[0].email){
                    return fn(items[0].email);
                }
            }
            return fn(null);
        });
    });
}

 routing.push(function(app) {
     app.post('/api/email/sendEmail', email_sendEmail);

 });