/**
 * Created by bernat on 18/04/16.
 */
var FacebookStrategy = require('passport-facebook').Strategy;
var configAuth = require('./auth');
module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });
    passport.use(new FacebookStrategy({
            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            profileFields: configAuth.facebookAuth.profileFields
        },

        myFacebookStrategy));

    function myFacebookStrategy(token, refreshToken, profile, done) {
            process.nextTick(function () {
            var newUser = Object();
            newUser.id = profile.id;
            newUser.name = profile.displayName;
            newUser.email = profile.emails[0].value;
            newUser.pic = profile.photos[0].value;
            newUser.provider = profile.provider;
            newUser.token = token;
            return done(null, newUser);
        });
    }
};