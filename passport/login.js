var LocalStrategy = require('passport-local').Strategy;
var UserModel = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function (passport) {
    
    passport.use('login', new LocalStrategy({
            passReqToCallback: true
        },
        function (req, username, password, done) {
            findOne(req, username, password, done);
        })
    );

    var findOne = function (req, username, password, done) {
        //check in mongo, if a user with this username exists or not?
        UserModel.User.findOne({'username': username},
            function (err, user) {
                if (err) {
                    return done(err);
                }

                if (!user) {
                    console.log('User NOT found with username ', username);
                    return done(null, false, req.flash('message', 'User Not found.'));
                }

                if (!isValidPassword(user, password)) {
                    console.log('Invalid Password');
                    return done(null, false, req.flash('message', 'Invalid Password'));
                }

                return done(null, user);
            }
        );
    };

    var isValidPassword = function(user, password) {
        return bCrypt.compareSync(password, user.password);
    };
};