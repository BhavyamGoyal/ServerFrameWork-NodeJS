var express = require('express');
var router = express.Router();
//var { sendVerificationEmail } = require('../API/EmailSystem/SendVerificationEmail');

/* GET home page. */
router.get('/', function (req, res, next) {
    var data = {
        name: "testroute",
        age:34
    }
    res.send(data);
});

router.post('/', function (req, res, next) {
    console.log("[test]"+req.body);
    res.send("recieved");
});

const email = "firststepeduapp@gmail.com";

router.get('/verify', function (req, res, next) {
    //res.send(sendVerificationEmail(email));
});

module.exports = router;