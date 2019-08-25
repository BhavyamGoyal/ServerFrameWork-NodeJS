var generateKey = require('./FW_VerificationKeyGenerator');
var sendEmail = require('../FW_Mailer');
var DBManager = require('./FW_DBManager');
const BASE_URL = `${serverSettings.ip}:${serverSettings.port}/verify`;

var using = 0;
if (using == 0) {
    DBManager.SetTable("CREATE TABLE IF NOT EXISTS verification_table ( emailid string , verification_key VARCHAR(100) NOT NULL,verification_status INT DEFAULT 0,  PRIMARY KEY (emailid))");
    console.log("you are using email verification in your server aapplication");
    using = 1;
}

const subject = "Please Verify your email id"
function CreateVerificationEntry(emailId, key) {
    var query = "INSERT INTO verification_table (emailid,verification_key)  VALUES ('" + emailId + "', '" + key + "')"
    DBManager.RunQuery(query);
}

async function CheckVerification(req, res) {
    var query = "Select emailid from verification_table where emailid = '" + req.params.emailid + "'";
    var result = await DBManager.RunQuery(query);
}

function UpdateVerification(req, res) {
    var query = "UPDATE verification_table SET verification_status = 1 where key ='" + req.params.key + "'";
    var result = DBManager.RunQuery(query);
}

const SendVerificationEmail = (emailId) => {
    var key = generateKey();
    var queryParameter = `/?k=${key}`;
    var verificationLink = BASE_URL + queryParameter;
    SendEmail(emailId, subject, verificationLink);
    CreateVerificationEntry(emailId, key)
};

module.exports = {
    SendVerificationEmail,
    CheckVerification,
    UpdateVerification
}
