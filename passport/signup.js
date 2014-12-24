var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function (passport) {

    passport.use('signup', new LocalStrategy({
            passReqToCallback:true
        },
        function(req, username, password, done) {
            findOrCreateUser(req, username, password, done);
        })
    );

    var findOrCreateUser = function (req, username, password, done) {
        User.findOne({'username': username},
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
        var newUser = new User();
        console.log('newUser: ', newUser);
        setUser(newUser, req, username, password, function (userData) {
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

    var setUser = function (newUser, req, username, password, next) {
        newUser.username = username;
        newUser.password = createHash(password);
        newUser.email = req.param('email');
        newUser.firstName = req.param('firstName');
        newUser.lastName = req.param('lastName');

        next(newUser);
    };

    var createHash = function(password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };
};