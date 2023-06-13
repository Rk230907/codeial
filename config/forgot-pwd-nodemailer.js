const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');


let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth:{
        user: 'development.ypatel@gmail.com',
        pass: 'pbbcvdbcaywhqfwp'
    }
  });

  module.exports = {
    transporter: transporter
}