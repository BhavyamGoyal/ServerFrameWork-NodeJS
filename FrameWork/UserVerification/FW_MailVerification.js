var generateKey = require('./FW_VerificationKeyGenerator');
var DBManager = require('../DatabaseManager/FW_DBManager');
var serverSettings=require('../../API/Strings/ServerSettings');
const BASE_URL = `${serverSettings.ip}:${serverSettings.port}/verifyEmail`;
var email=require('../FW_Mailer');
var using = 0;
if (using == 0) {
    DBManager.SetTable("CREATE TABLE IF NOT EXISTS verification_table ( emailid VARCHAR(50) , verification_key VARCHAR(100) NOT NULL,verification_status INT DEFAULT 0,  PRIMARY KEY (emailid))");
    console.log("[FW_MailVerification]you are using email verification in your server aapplication");
    using = 1;
}

const subject = "Please Verify your email id"
function CreateVerificationEntry(emailId, key) {
    var query = "INSERT INTO verification_table (emailid,verification_key)  VALUES ('" + emailId + "', '" + key + "')"
    DBManager.RunQuery(query);
}

async function CheckVerification(req,res,err) {
    var query = "Select verification_status from verification_table where emailid = '" + req.params.emailid + "'";
    var result = await DBManager.RunQuery(query);
    var message;
    console.log("[FW_MailVerification]query result check verification "+result);
    if(result[0].verification_status==1){
        message={message:"Verified"};
    }else{
        message={message:"EmailNotVerified"};
    }
    res.send(message);
}

async function UpdateVerification(req,res,err) {
    console.log("\n[FW_MailVerification] Verifying Email "+req.query.k);
    var query = "UPDATE verification_table SET verification_status = 1 where verification_key ='" + req.query.k + "'";
    var result = await DBManager.RunQuery(query);
    
    var message;
    if(result.affectedRows==1){
        message="Your Email Has Been Successfully Verified";
    }else{
        message="Email Not Verified/Not Found";
    }
    res.send(message);
}

const SendVerificationEmail = (emailId) => {
    console.log("\n\n[FW_MailVerification] checking verification status");
    var key = generateKey.generateKey().key;
    var queryParameter = `/?k=${key}`;
    var verificationLink = BASE_URL + queryParameter;
    var message="Hello,\nThank you for registering for MediShorts\nplease click the link bellow to verify your email\n\n"+verificationLink;
    email.SendEmail(emailId, subject, message);
    CreateVerificationEntry(emailId, key)
};

module.exports = {
    SendVerificationEmail,
    CheckVerification,
    UpdateVerification
}
