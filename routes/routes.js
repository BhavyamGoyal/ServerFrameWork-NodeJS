const routes = require('express').Router();
var testRouter = require('./test');
var mailVerification=require('../FrameWork/UserVerification/FW_MailVerification');
mailVerification.SendVerificationEmail

// to setup the name of the database and change server settings change details in server settings
//uncomment 2 lines bellow if you want email verification

routes.get('/checkVerification/:emailid',mailVerification.CheckVerification);
routes.get('/verifyEmail/:key',mailVerification.UpdateVerification);

// to verify mail call the funtion SendVerificationmail in FW_MailVerification.js while registering user and pass email in it.

routes.post('/RegisterUser',function (req, res, next) {
    console.log("[routes]Sending email to "+req.body.emailID);
    mailVerification.SendVerificationEmail(req.body.emailID);
    //register other parameters in you user table here
    res.send("email sent");
});



routes.use('/test', testRouter );

module.exports = routes;
