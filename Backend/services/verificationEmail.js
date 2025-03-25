const nodemailer = require("nodemailer")

const sendVerificationEmail = async (options) => {
   var transporter = nodemailer.createTransport({
       service: "gmail",

       auth : {
        //    user: process.env.EMAIL,
        //    pass: process.env.EMAIL_PASSWORD,
        user: "rohitvanja865@gmail.com",
        pass: "stto nwsz cfnr zmmn",
       }
   });

   const mailOptions = {
       from: "Rohit magar <rohitvanja865@gmail.com>",
       to: options.email,
       subject: options.subject,
       text: options.message
   };

   await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;