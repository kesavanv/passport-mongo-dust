var mongoose = require('mongoose');
var bCrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
    id: String,
    username: String,
    password: String,
    email: String,
    firstName: String,
    lastName: String
});

var User = mongoose.model('User', userSchema);

var updateUser = function (user, req, username, password, next) {
    user.username = username;
    user.password = createHash(password);
    user.email = req.param('email');
    user.firstName = req.param('firstName');
    user.lastName = req.param('lastName');

    next(user);
};

var createHash = function(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

module.exports = {
    User: User,
    userSchema: userSchema,
    updateUser: updateUser
};