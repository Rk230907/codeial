const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');
const env = require('../.env');


let transporter = nodemailer.createTransport(env.smtp);

let renderTemplate = (data, relativePath) =>{
    let mailHTML;
    ejs.renderFile( 
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template){
            if(err){
                console.log('error in rendering template', err);
                return;
            }
            mailHTML = template;
        }
    )
    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}