const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const resetPwdMailer = require('../mailers/forgot-pwd-mailer');
const Friendship = require('../models/friendship');

// promisify User.findById
const findById = promisify(User.findById).bind(User);

// promisify fs.unlinkSync
const unlinkSync = promisify(fs.unlinkSync);

// let's keep it same as before
module.exports.profile = function(req, res) {
  
    User.findById(req.params.id)
      .then(user => {
    
        return res.render('user_profile', {
          title: 'User Profile',
          profile_user: user,
        });
      })
      .catch(err => {
        console.error(err);
        return res.redirect('back');
      });
  };
  
  

  module.exports.update = async function(req, res){
   

    if(req.user.id == req.params.id){

        try{

            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if (err) {console.log('*****Multer Error: ', err)}
                
                user.name = req.body.name;
                user.email = req.body.email;

                if (req.file){

                    if (user.avatar){

                        if (fs.existsSync(path.join(__dirname, '..', user.avatar))) {
                            fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                        }
                    }
                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }


    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
};


// render the sign up page
module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}

// render the sign in page
module.exports.signIn = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    });
}

// get the sign up data
module.exports.create = async function(req, res){
    try {
        if (req.body.password != req.body.confirm_password){
            req.flash('error', 'Passwords do not match');
            return res.redirect('back');
        }
        const user = await User.findOne({email: req.body.email});
        if (!user){
            await User.create(req.body);
            req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('/users/sign-in');
        } else {
            req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back');
        }
    } catch (err) {
        console.error(err);
        req.flash('error', err);
        return res.redirect('back');
    }
}

// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res) {
    req.logout(function(err) {
      if (err) {
        console.error(err);
        return res.redirect('back');
      }
      req.flash('success', 'You have logged out!');
      return res.redirect('/');
    });
  };
  

  module.exports.forgotPwd = async (req, res) => {
    console.log('Sending mail');
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        req.flash('error','Email does not exist. Please sign up!!')
        // console.log('inside flash');
        return res.render('user_sign_in',  { error: 'Email not found', title: "Codeial | Sign In"});

      }
  
      const token = generateToken();
      console.log(token);
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
      await user.save();

      resetPwdMailer.resetPwd(user, token, email);
      
      res.render('user_sign_in', { success: 'Reset link sent to your email' , title: "Codeial | Sign In" });
    } catch (error) {
      console.log(error);
      res.render('user_sign_in', { error: 'Something went wrong' , title: "Codeial | Sign In" });
    }
  };
  
  // Generate a random token
  function generateToken() {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = 32;
    let token = '';
  
    for (let i = 0; i < length; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  
    return token;
  };


  module.exports.resetPassword = async function(req, res) {
    const { email, password, confirm_password, token } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        req.flash('error', 'Email not found');
        return res.redirect('back');
      }
  
      if (user.resetToken !== token || user.resetTokenExpiration < Date.now()) {
        req.flash('error', 'Invalid or expired reset token');
        return res.redirect('back');
      }
  
      if (password !== confirm_password) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
      }
  
      user.password = password;
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
      await user.save();
  
      req.flash('success', 'Password reset successfully');
      return res.redirect('/users/sign-in');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Something went wrong');
      return res.redirect('back');
    }
  }

  module.exports.renderResetPassword = function(req, res) {
    const token = req.params.token;
    const { email } = req.query;
    // Resolve the file path to the "reset_password" template file
    const filePath = path.join(__dirname, '../views/reset_password.ejs');
    // You can pass the token to the reset password page template if needed

    res.render(filePath, { token, email , title: "Codeial | Reset Password"});
  };

  
  


