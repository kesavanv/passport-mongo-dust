var login = require('./login');
var signup = require('./signup');
var UserModel = require('../models/user');

module.exports = function (passport) {
    
    passport.serializeUser(function (user, done) {
        console.log('serializing user: ', user);
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        UserModel.User.findById(id, function (err, user) {
            console.log('deserializing user: ', user);
            done(err, user);
        });
    });

    // Setting up Passport strategies for Login and Signup/Registration
    login(passport);
    signup(passport);
};