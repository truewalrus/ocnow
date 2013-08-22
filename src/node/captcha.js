var simple_recaptcha = require('simple-recaptcha');

function captcha_verify(req, res, next){

    if (req.user){
        if(canCreatePoster(req.user.rank)){
            console.log("captcha not needed, user is an admin");
            next();
            return;
        }
    }

    var privateKey = '6LcFauYSAAAAAIm-bgppWu-Gjp2bnv9PgzFfQO3M'; // your private key here
    var ip = req.ip;
    var challenge = req.body.recaptcha_challenge_field;
    var response = req.body.recaptcha_response_field;

    simple_recaptcha(privateKey, ip, challenge, response, function(err) {
        if (err){
            console.log(err.message);
            return res.send('Incorrect captcha, please reenter.', 401);
        }
        next();
    });
}
/*
routing.push(function(app) {

});*/