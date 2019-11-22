const nodemailer = require("nodemailer");

//Method to send email to a user
var SendEmail =async function (to, subject, text) {
    return new Promise(resolve => {
        console.log("[FW_Mailer] mailing to "+to);
        var mailOptions = {
            to: to,
            subject: subject,
            text: text
        }

        //Define mail transport system
        var smtpTransport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: "firststepeduapp@gmail.com",
                pass: "First$tep123"
            }
        });

        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log("[FW_Mailer]" + error);
                resolve(0);
            } else {
                console.log("[FW_Mailer]Message sent: " + response);
                resolve(1);
            }
        });
    });
}

module.exports = { SendEmail }