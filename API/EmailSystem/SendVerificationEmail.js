
const { generateKey } = require('./VerificationKeyGenerator');
const { sendEmail } = require('./EmailController');
const  serverSettings = require('../Strings/ServerSettings');
const verificationDatabase = require('../DatabaseManager/VerificationQueries');
const BASE_URL = `${serverSettings.ip}:${serverSettings.port}/verify`;
const subject = "Please Verify your email id"

const sendVerificationEmail = (emailId, userId) => {
const { key, expires } = generateKey();
    var queryParameter = `/?k=${key}`;
    const verificationLink = BASE_URL + queryParameter;
    sendEmail(emailId, subject, verificationLink);
    verificationDatabase.createVerificationEntry(userId, key)
};

module.exports = { sendVerificationEmail }
