var express = require('express');
var router = express.Router();
const verificationDatabase = require('../../API/DatabaseManager/VerificationQueries.js');


/* GET home page. */
router.get('/', function (req, res, next) {
	//var flag=0;
	//console.log(flag);
    verificationDatabase.fetchUser(req.query.k, function (flag) {

    		console.log("[Verify]"+flag);
    		if (flag == 0)
    		res.send("Email is not verified. Wrong key = " + req.query.k);
    		else    
     		res.send("Email is verified. Your key = " + req.query.k);

    });

});

module.exports = router;
