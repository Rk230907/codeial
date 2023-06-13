const nodemailer = require('../config/forgot-pwd-nodemailer');

exports.resetPwd = (user, token, email)=> {
    console.log('Email sent to - ', email);

    nodemailer.transporter.sendMail({
        from: 'development.ypatel@gmail.com',
        to: user.email, 
        subject: "Your password reset link",
        text: `Click the following link to reset your password: http://localhost:8000/reset/password/${token}?email=${email}`
      }, (err, info) => {
        if (err) {
          console.log('Error in sending mail', err);
          return;
        }
        console.log('Mail delivered', info);
        return;
      });
  

   
}