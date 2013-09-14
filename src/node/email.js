var nodemailer = require("nodemailer");
var bcrypt = require('bcrypt-nodejs');

var sendgridActive = false;
if (process.env.SENDGRID_USERNAME){
    var sendgrid = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);
    sendgridActive = true;
}


var smtp_options = {
    service: "gmail",
    auth: {
        user: 'unbreakablescorpions@gmail.com',
        pass: 'Fgmichael'
    }
}

var transport = nodemailer.createTransport('SMTP', smtp_options);

function email_sendEmail(request, response){

    var nonce = email_nonce(32);
    var resetURL = 'localhost:1337/pwreset/' + nonce;
    var d = new Date();


    var userEmail = email_findByUsername(request.body.username, function(user){

        if (user && user.email){
            var mailOptions = {
                from: "MyOcNow@MyOcNow.com",
                to: user.email,
                subject: "My OC Now Password Recovery",
                html: request.body.username + ', <br><br> A request has been made to reset the password for your account on My OC Now. If you made this request, ' +
                    'click the link below or copy and paste it into your browser and follow the directions: <br><br>' +'<a href ="http://'+resetURL+'">http://'+resetURL+'</a>'+ '<br><br> If you did not make a request to reset ' +
                    'your password, this email can safely be ignored. <br><br> -My OC Now Team. <br><br> This is an automated email, do not respond to this message.'
            }


            if(sendgridActive){
                sendgrid.send(mailOptions, function (err, resp){
                    if (err) {
                        console.error(err);
                        return response.send(500,err);
                    }
                    else{
                        console.log(resp.message);
                        db_connector.collection('users', function(err, collection) {
                            collection.update({'_id': user._id}, {$set:{'pwrskey': nonce, 'pwrsexpire': d.getTime()+2*60*60*1000} }, function(err, item) {
                                if (err) { return fn(err); }
                            });
                        });
                        return response.send(200);
                    }
                });
            }
            else{
                transport.sendMail(mailOptions, function (error, resp){
                    if (error){
                        console.log(error);
                        return response.send(500, error);
                    }else{
                        console.log(resp.message);
                        db_connector.collection('users', function(err, collection) {
                            collection.update({'_id': user._id}, {$set:{'pwrskey': nonce, 'pwrsexpire': d.getTime()+2*60*60*1000} }, function(err, item) {
                                if (err) { return fn(err); }
                            });
                        });
                        return response.send(200);
                    }
                });
            }



        }
        else{
            return response.send(200);
        }

    });

}

function email_findByUsername(username, fn) {
    db_connector.collection('users', function(err, collection) {
        collection.findOne({'id': username.toUpperCase()}, function(err, item) {
            if (err) { return fn(err); }

            if (item && item.email) {
                console.log(item);
                return fn(item);
            }
            return fn(null);
        });
    });
}

function email_nonce(size){
    var ret = '';
    for (var x = 0; x < size; x++){
        var r = Math.floor(Math.random() * 255);
        ret += String.fromCharCode(r);
    }
    ret = new Buffer(ret).toString('base64').replace('+', '-').replace('/', '_').replace('=', ',');
    console.log(ret);
    return ret;
}

function email_resetPassword(request, response){
    db_connector.collection('users', function(error, users) {

        var salt = bcrypt.genSaltSync();
        var password = bcrypt.hashSync(request.body.newPassword, salt);
        var d = new Date();

        users.findAndModify( { 'pwrsexpire': {$gt: d.getTime()}, pwrskey: request.body.resetCode }, [], { $set: {"password":password}, $unset:{"pwrskey": ""} }, {new:true}, function(error, data) {
            if (error) { return response.send(500) }
            else{
                if(data){
                    console.log(data);
                    response.send(200);
                }
                else{
                    return response.send(404, "Invalid key or key timed out, please try again.")
                }

            }
        });
    });
}

function email_notifications(){
    var numUnpublished = 0;
    db_connector.collection('articles', function(err, collection) {
        collection.find({"published": false }).count(function(err, data){
            if (err) {
                return;
            }
            else {
                //  console.log(data);
                numUnpublished = data;

                var numFlagged = 0;
                db_connector.collection('comments', function(err, comments) {
                    comments.find({'flagged': true}).count(function(err, data) {
                        if(err){
                            return;
                        }
                        else
                        {
                            numFlagged = data;

                            var mailOptions = {
                                from: "MyOcNow@MyOcNow.com",
                                to: 'unbreakablescorpions@gmail.com',
                                subject: "My OC Now Admin Notifications",
                                html: 'Good morning! <br><br> You have ' +numUnpublished+ ' unpublished article(s) that need your approval and ' +numFlagged+ ' comment(s) that have been flagged as inappropriate by users.'
                            }

                            if (sendgridActive){
                                sendgrid.send(mailOptions, function (err, resp){
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }
                                    else{
                                        console.log(resp.message);
                                        return ;
                                    }
                                });
                            }
                            else{
                                transport.sendMail(mailOptions, function (error, resp){
                                    if (error){
                                        console.log(error);
                                        return;
                                    }else{
                                        console.log(resp.message);
                                        return;
                                    }
                                });
                            }

                        }
                    });
                });
            }
        });
    });




}

setInterval(email_notifications, 24*60*60*1000);

 routing.push(function(app) {
     app.post('/api/email/sendEmail', email_sendEmail);
     app.post('/api/email/resetPassword', email_resetPassword);

 });