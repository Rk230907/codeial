const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');


//Tell passport to use a new strategy for google login
passport.use(new googleStrategy({
        clientID: "187270952782-m7ool49ckt2nqjo3v9aabpta068il6d6.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8000/users/auth/google/callback",
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
              return User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
              });
            }
          })
            .catch(err => {
            console.log('Error in google strategy passport', err);
            return done(err);
          });
      }
));      


module.exports = passport;