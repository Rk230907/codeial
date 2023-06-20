const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');
const env = require('../environment');


let transporter = nodemailer.createTransport(env.smtp);

  module.exports = {
    transporter: transporter
}