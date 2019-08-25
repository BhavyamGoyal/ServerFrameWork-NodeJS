const nodemailer = require("nodemailer");

//Method to send email to a user
var SendEmail = function (to, subject, text) {
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
            console.log("[EmailController]"+error);
            res.end("error");
        } else {
            console.log("[EmailController]Message sent: " + response.message);
            res.end("sent");
        }
    });
}

module.exports = { sendEmail }