var LocalStrategy = require('passport-local').Strategy;
var UserModel = require('../models/user');

module.exports = function (passport) {

    passport.use('signup', new LocalStrategy({
            passReqToCallback:true
        },
        function(req, username, password, done) {
            findOrCreateUser(req, username, password, done);
        })
    );

    var findOrCreateUser = function (req, username, password, done) {
        UserModel.User.findOne({'username': username},
            function (err, user) {
                if (err) {
                    console.log('Error in signup ', err);
                    return done(err);
                }

                if (user) {
                    console.log('User already exists with username ', username);
                    return done(null, false, req.flash('message','User Already Exists'));
                } else {
                    // Now create a new user
                    console.log('User does NOT exists already');
                    createUser(req, username, password, done);
                }
            }
        );
    };

    var createUser = function (req, username, password, done) {
        var newUser = new UserModel.User();
        console.log('newUser: ', newUser);
        UserModel.updateUser(newUser, req, username, password, function (userData) {
            userData.save(function (err) {
                if (err) {
                    console.log('Error in Saving user', err);
                    throw err;
                }

                console.log('User Registration successful');
                return done(null, newUser);
            });
        });
    };
};