var generateKey = require('./FW_VerificationKeyGenerator');
var DBManager = require('../DatabaseManager/FW_DBManager');
var serverSettings = require('../../API/Strings/ServerSettings');
const BASE_URL = `${serverSettings.ip}:${serverSettings.port}/verifyEmail`;
const RESET_BASE_URL = `${serverSettings.ip}:${serverSettings.port}/resetAccount`;
var email = require('../FW_Mailer');
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

async function CheckVerification(req, res, err) {
    var query = "Select verification_status from verification_table where emailid = '" + req.params.emailid + "'";
    var result = await DBManager.RunQuery(query);
    var message;
    console.log("[FW_MailVerification]query result check verification " + result);
    if (result[0].verification_status == 1) {
        message = { message: "Verified" };
    } else {
        message = { message: "EmailNotVerified" };
    }
    res.send(message);
}

async function UpdateVerification(req, res, err) {
    console.log("\n[FW_MailVerification] Verifying Email " + req.query.k);
    var query = "UPDATE verification_table SET verification_status = 1 where verification_key ='" + req.query.k + "'";
    var result = await DBManager.RunQuery(query);

    var message;
    if (result.affectedRows == 1) {
        message = "Your Email Has Been Successfully Verified";
    } else {
        message = "Email Not Verified/Not Found";
    }
    res.send(message);
}

var EmailResetCallBack=null;
const SetEmailResetCallBack=function(resetcallback){
    EmailResetCallBack=resetcallback;
}

const SendResetEmail=async function(emailid){
    return new Promise(async function(resolve,reject) {
        console.log("\n\n[FW_MailVerification] sending resset mail");
        var result = await DBManager.RunQuery("SELECT verification_key FROM verification_table WHERE emailid = "+emailid);
        if (result!=-1){
            key=result.verification_key;
        }
        var queryParameter = `/?k=${key}`;
        var verificationLink = RESET_BASE_URL +"/emailId" + queryParameter;
        var message = "Hello,\nBy clicking on this link you will reset your account and will be able to register with this email id again.\n\n Link:\n" + verificationLink;
        var result = await email.SendEmail(emailId, subject, message);
        resolve(result);
    });
}

const SendVerificationEmail = async function(emailId) {
    return new Promise(async function(resolve,reject) {
        console.log("\n\n[FW_MailVerification] sending verification mail");
        var key = generateKey.generateKey().key;
        var queryParameter = `/?k=${key}`;
        var verificationLink = BASE_URL + queryParameter;
        var message = "Hello,\nThank you for registering for MediShorts\nplease click the link bellow to verify your email\n\n" + verificationLink;
        var result = await email.SendEmail(emailId, subject, message);
        resolve(result);
        CreateVerificationEntry(emailId, key)
    });
};

async function ResetVerification(req, res, err){
    var query = "DELETE FROM verification_table WHERE verification_key = " + req.query.k;
    var result = await DBManager.RunQuery(query);
    if (result.affectedRows == 1) {
        res.send("you can now register again");
        EmailResetCallBack(req.params.emailid);
    }
}

module.exports = {
    SendVerificationEmail,
    CheckVerification,
    UpdateVerification,
    ResetVerification,
    SetEmailResetCallBack,
    SendResetEmail
}
