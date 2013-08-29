var nodemailer = require("nodemailer");

var smtp_options = {
    service: "Gmail",
    auth: {
        user: 'gorrum@gmail.com',
        pass: ''
    }
}

var transport = nodemailer.createTransport('SMTP', smtp_options);

function email_sendEmail(req, res){
    var mailOptions = {
        from: "me@tr.ee",
        to: "unbreakablescorpions@gmail.com",
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

}

 routing.push(function(app) {
     app.post('/api/email/sendEmail', email_sendEmail);

 });