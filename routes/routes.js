var routes = require('express').Router();
var testRouter = require('./test');
var mailVerification = require('../FrameWork/UserVerification/FW_MailVerification');
mailVerification.SendVerificationEmail

// to setup the name of the database and change server settings change details in server settings
//uncomment 2 lines bellow if you want email verification

routes.get('/checkVerification/:emailid', mailVerification.CheckVerification);
routes.get('/verifyEmail', mailVerification.UpdateVerification);

// to verify mail call the funtion SendVerificationmail in FW_MailVerification.js while registering user and pass email in it like bellow.

// routes.post('/RegisterUser', function (req, res, err) {
   
//         console.log("\n\n[routes]RegisterUser Post Request Data " + JSON.stringify(req.body));
//         mailVerification.SendVerificationEmail(req.body.emailID);
//         res.send({ message: "email sent" });
//         //register other parameters in you user table here

// });

routes.get('/', function (req, res, next) {
    res.send("1234");
});


routes.use('/test', testRouter);

module.exports = routes;
