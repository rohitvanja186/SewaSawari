const nodemailer = require("nodemailer")

const sendVerificationEmail = async (options) => {
   var transporter = nodemailer.createTransport({
       service: "gmail",

       auth : {
           user: process.env.EMAIL,
           pass: process.env.EMAIL_PASSWORD,
       }
   });

   const mailOptions = {
       from: "Rohit magar <rohitmagar570@gmail.com>",
       to: options.email,
       subject: options.subject,
       text: options.message
   };

   await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;