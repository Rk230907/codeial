const nodemailer = require('../config/nodemailer');

//Other way to write module.exports
exports.newComment = (comment)=> {
    console.log('Inside new comment mailer', comment);

    let htmlString = nodemailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs')

    nodemailer.transporter.sendMail({
        from: 'development.ypatel@gmail.com',
        to: comment.user.email,
        subject: "New Comment on your post",
        html: htmlString
    }, (err, info)=>{
        if(err){
            console.log('Error in sending mail', err);
            return;
        }

        console.log('Mail delivered', info);
        return;
    });
}