const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('../.env');


//Tell passport to use a new strategy for google login
passport.use(new googleStrategy({
        clientID: env.google_client_ID,
        clientSecret: env.google_client_Secret,
        callbackURL: env.google_call_back_URL,
    },


    function(accessToken, refreshToken, profile, done) {
      // Find a user
      User.findOne({ email: profile.emails[0].value })
        .exec()
        .then(user => {
          console.log(profile);
          if (user) {
            // If found, set this user as req.user
            return done(null, user);
          } else {
            // If not found, create this user and set it as req.user
            User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              password: crypto.randomBytes(20).toString('hex')
            })
              .then(newUser => {
                return done(null, newUser);
              })
              .catch(createError => {
                console.log('Error creating user:', createError);
                return done(createError);
              });
          }
        })
        .catch(findError => {
          console.log('Error in Google strategy Passport:', findError);
          return done(findError);
        });
    }
    

    // function(accessToken, refreshToken, profile, done) {
    //     // Find a user
    //     User.findOne({ email: profile.emails[0].value })
    //       .exec()
    //       .then(user => {
    //         console.log(profile);
    //         if (user) {
    //           // If found, set this user as req.user
    //           return done(null, user);
    //         } else {
    //           // If not found, create this user and set it as req.user
    //             return User.create({
    //             name: profile.displayName,
    //             email: profile.emails[0].value,
    //             password: crypto.randomBytes(20).toString('hex')
    //           });
    //         }
    //       })
    //         .catch(err => {
    //         console.log('Error in google strategy passport', err);
    //         return done(err);
    //       });
    //   }
));      


module.exports = passport;