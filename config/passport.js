/**
 * Created by bernat on 21/03/16.
 */

var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

module.exports = function (password) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
        function (req, email, password, done) {
            process.nextTick(function (){
                User.findOne({'local.email': email}, function (err, user) {
                    if (err)
                    return done(err);

                    if(user){
                        return done(null, false, req.flash('signupMessage', 'Email taken'));
                    }else{
                        var newUser = new User();
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);

                        newUser.save(function (err) {
                            if (err)
                            throw err;
                            return done (null, newUser);
                        });
                    }
                });
            });
        }));
};