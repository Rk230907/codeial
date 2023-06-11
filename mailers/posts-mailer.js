const nodemailer = require('../config/nodemailer');

//Other way to write module.exports
exports.newPost = (post)=> {
    console.log('Inside new comment mailer', comment);

    let htmlString = nodemailer.renderTemplate({post: post}, '/posts/new_post.ejs')

    nodemailer.transporter.sendMail({
        from: 'development.ypatel@gmail.com',
        to: post.user.email,
        subject: "Your post was published successfully!!!",
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