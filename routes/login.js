/**
 * Created by bernat on 21/03/16.
 */

var passport = require('passport');
require('../config/passport')(passport);
var usuario = require('../models/user.js');
var token = require('../models/authToken.js');
var jwtoken = require('../config/jwtauth.js');
var mongoose = require('mongoose');
module.exports = function (app) {
    getProfile = function (req, res, next) {
    
        console.log(req.user.id);
        usuario.findOne({"id_facebook": req.user.id}, function (err, user){
            if(user==undefined){
                console.log('No hay usuario con esa id');
                var newUserFB= new usuario({
                    id_facebook:req.user.id,
                    username:req.user.name,
                    mail:req.user.email,
                    imageUrl:req.user.pic
                });

                // console.log(newTokenFB);
                // console.log(newUserFB);
                newUserFB.save(function (err) {
                    if(err)
                        throw err;
                    console.log('Guardo el usuario de Facebook');
                });
                var newTokenFB=new token({
                    token:req.user.token,
                    idFB:req.user.id,
                    userid: newUserFB._id
                });
                console.log(newTokenFB);
                newTokenFB.save(function (err, data) {
                    if(err)
                        throw err;
                    console.log(newTokenFB);
                    console.log('Guardo el token de Facebook');
                });
                res.json(newTokenFB)
            }
            else {
                console.log('Holas');
                
                var newTokenFBExistente=new token({
                    token:req.user.token,
                    idFB:req.user.id,
                    userid: user._id
                });
                newTokenFBExistente.save(function (err, data) {
                    if(err)
                        throw err;
                    console.log(newTokenFBExistente);
                    console.log('Guardo el token de Facebook de un usuario existente');
                    res.json(newTokenFBExistente)
                });
            }

          

        });
    };

    getFacebookCallback = passport.authenticate('facebook', {
        successRedirect: '/social',
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