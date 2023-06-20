const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');
const env = require('../.env');


let transporter = nodemailer.createTransport(env.smtp);

  module.exports = {
    transporter: transporter
}