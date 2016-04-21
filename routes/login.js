/**
 * Created by bernat on 21/03/16.
 */

var passport = require('passport');
require('../config/passport')(passport);
var usuario = require('../models/user.js');
module.exports = function (app) {
    getProfile = function (req, res, next) {
        console.log(req.user);
        res.redirect('/');
        
    };

    getFacebookCallback = passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/'
    });
    getFacebookAuth = passport.authenticate('facebook', {
        scope: ['public_profile', 'email', 'user_friends']
    });
    function isAuth(req, res, next) {
        console.log(req.isAuthenticated());
        if (req.isAuthenticated())
            return next();

        res.redirect('/');
    }
    app.get('/profile', isAuth, getProfile);
    app.get('/auth/facebook/callback', getFacebookCallback);
    app.get('/auth/facebook', getFacebookAuth);
};