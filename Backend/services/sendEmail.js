const nodemailer = require("nodemailer")

const sendEmail = async (options) => {
   var transporter = nodemailer.createTransport({
       service: "gmail",

       auth : {
           user: "rohitvanja865@gmail.com",
           pass: "stto nwsz cfnr zmmn",
       }
   });

   const mailOptions = {
       from: "Rohit magar <rohitvanja865@gmail.com>",
       to: options.email,
       subject: options.subject,
       text: "Your otp is " + options.otp
   };

   await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;