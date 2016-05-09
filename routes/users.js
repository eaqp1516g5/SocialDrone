/**
 * Created by bernat on 13/04/16.
 */
//Funciones backend para el usuario
var jwt    = require('jsonwebtoken');
var formidable = require('formidable');
var fs = require('fs');
var util = require('util');
var fse = require('fs-extra');
var express = require('express');
var multipart = require('connect-multiparty');
var sha256 = require('js-sha256');
var multipartMiddleware = multipart();
var __dirname = '/var/www/html/images/';
var URL = 'http://localhost/images/';
module.exports = function (app) {

    var usuario = require('../models/user.js');
    var token = require('../models/authToken.js');
    var jwtoken = require('../config/jwtauth.js');
    var username;
    var follow = require('../models/follow.js');

    getUsers= function (req, res, next) {
        var resultado = res;
        usuario.find({}, {username:1, mail: 1, name: 1, lastname:1, createdAt:1, role:1, imageUrl:1}, function (err, users) {

            if (users.length ==0){
                resultado.status(404).send('No hay usuarios');
            }

            else   if (err)
                res.send(500,err.message);
            else
                res.status(200).json(users); // devuelve todos los Users en JSON
        });
    };
    getUser= function (req, res, next) {
        var resultado = res;
        usuario.findOne({"_id": req.params.user_id}, function (err, user) {
            if (user == null){
                resultado.status(404).send('No existe el usuario');
            }
            else   if (err)
                res.send(500,err.message);
            else
                res.status(200).json(user); // devuelve todos los Users en JSON
        });
    };
    addUser= function(req, res, next) {
        var resultado = res;
        if (!req.body.username || !req.body.mail) {
            res.status(400).send('Bad request');
        }
        else {
            console.log('Guardo la imagen');
            console.log('imageURL+++++++++++++'+req.body.imageUrl);
            if(req.body.usuarioSocial){
                usuario.find({username: req.body.username}, function (err, user) {
                    if (user.length != 0) {
                        console.log('Conflict');
                        resultado.status(409).json(user);
                    }
                    else {
                        var newUser = new usuario({
                            id_facebook: req.body.id_facebook,
                            username: req.body.username,
                            mail: req.body.mail,
                            imageUrl: req.body.imageUrl
                        });
                        newUser.save(function (err) {
                            if (err) res.status(500).send('Internal server error');
                            else {
                                var followModel = new follow ({
                                    userid:req.body.id_facebook,
                                    following:{},
                                    follower:{}
                                });
                                followModel.save(function (err, data) {
                                    if(err)
                                        console.log(err);
                                    else
                                        res.status(200).json(newUser);
                                })

                            }

                        });
                    }
                })
            }
           else  if (req.files.imageUrl != undefined) {
                console.log(req.files.imageUrl);
                console.log('Entro????');
                fs.readFile(req.files.imageUrl.path, function (err, data) {
                    console.log(req.body.username);
                    var imageName = 'profile_'+req.body.username+'.png';
                    console.log(imageName);
                    var path = __dirname +'/'+ imageName;
                    console.log(path);
                    fs.writeFile(path, data, function (err) {
                        console.log('Guardamos el usuario');
                        usuario.find({username: req.body.username}, function (err, user) {
                            if (user.length != 0) {
                                resultado.status(409).send('Username already exists');
                            }
                            else {
                                var newUser = new usuario({
                                    username: req.body.username,
                                    name: req.body.name,
                                    lastname: req.body.lastname,
                                    password: sha256(req.body.password),
                                    mail: req.body.mail,
                                    imageUrl: URL + imageName
                                });
                                console.log(newUser._id);
                                newUser.save(function (err) {
                                    if (err) res.status(500).send('Internal server error');
                                    else{
                                        var followModel = new follow ({
                                            userid:newUser._id,
                                            following:{},
                                            follower:{}
                                        });
                                        followModel.save(function (err, data) {
                                            if(err)
                                                console.log(err);
                                            else
                                                res.status(200).json(newUser);
                                        });
                                        //res.status(200).json(newUser);
                                    }
                                });
                            }
                        })

                    });

                });
            }
            else {
                usuario.find({username: req.body.username}, function (err, user) {
                    if (user.length != 0) {
                        resultado.status(409).send('Username already exists');
                    }
                    else {
                        var newUser = new usuario({
                            username: req.body.username,
                            name: req.body.name,
                            lastname: req.body.lastname,
                            password: sha256(req.body.password),
                            mail: req.body.mail
                        });
                        newUser.save(function (err) {
                            if (err) res.status(500).send('Internal server error');
                            else{
                                var followModel = new follow ({
                                    userid:newUser._id,
                                    following:{},
                                    follower:{}
                                });
                                followModel.save(function (err, data) {
                                    if(err)
                                        console.log(err);
                                    else
                                        res.status(200).json(newUser);
                                })
                                };
                        });
                    }
                })
            }
        }
    };



    deleteUser= function (req, res, next) {
        var resultado = res;
        usuario.find({"username": req.params.username}, function (err, user) {
            if (user.length == 0) {
                resultado.status(404).send('Usuario no encontrado');
            }

            else{
                usuario.remove({"username": req.params.username},
                    function(err){
                        if(err){
                            res.send(err);
                        }
                        else{
                            res.status(200).send("Usuario borrado correctamente");
                        }
                    });
            }
        });
    };

    updateUser=function(req, res){
        var resultado = res;
        console.log(req.body.username);
        if (!req.params.userName)
            res.status(400).send('You must especify the username');
        else {
            console.log(req.body);
            usuario.find({"username": req.params.userName}, function (err, user) {
                if (user.length == 0) {
                    resultado.status(404).send('Usuario no encontrado');
                }
                else {


                    usuario.findOneAndUpdate({"username": req.params.userName}, req.body, {upsert: true}, function (err, user) {
                        if (err)
                            resultado.status(500).send('Internal server error');
                        else {
                            resultado.status(200).json(user);
                        }

                    });
                }

            });
        }
    };

    loginUser = function (req, res) {
        var resultado = res;
        if (!req.body.username || !req.body.password  )
            res.status(400).send('You must especify the username and password');
        else {
            usuario.find({"username": req.body.username}, function (err, user) {
                if (user.length == 0) {
                    resultado.status(404).send('Usuario no encontrado');
                    return resultado.status(404).jsonp({"loginSuccessful": false, "username": req.body.username });
                }
                else {
                    console.log(user[0].password);
                    if(user[0].password==sha256(req.body.password)){
                        console.log('Password correcto');
                        return resultado.status(200).jsonp({"loginSuccessful": true, "user": user});
                    }
                    else {
                        return resultado.status(404).jsonp({"loginSuccessful": false, "username": req.body.username});
                    }
                }
            });

        }
    };

    loginToken=function (req, res) {
        var resultado = res;
        if (!req.body.username || !req.body.password)
            res.status(400).send('You must especify the username');
        else {
            usuario.findOne({"username": req.body.username}, function (err, user) {
                if (err)
                    throw err;
                if(!user){
                    res.json({ success: false, message: 'Authentication failed. User not found.' });
                }
                else if (user) {
                    if (user.password != sha256(req.body.password)) {
                        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                    } else {
                        var Token = jwt.sign(user, 'zassssssssssss', {
                            expires: Math.round((new Date().getTime()/1000)) + 60});
                        console.log(Math.round((new Date().getTime()/1000)) + 60);
                        var newToken = new token({
                            "token":Token,
                            "userid":user._id
                        });
                        console.log(newToken);

                        newToken.save(function (err) {
                            if(err)
                                throw err;
                            console.log('Llego');
                            res.json(newToken);
                        });

                    }
                }
            })
        }
    };

    logout=function(req, res){
        console.log(req.params.userid);
        var resultado = res;
        if (!req.params.userid)
            res.status(400).send('You must especify the username');
        else {
            token.find({"_id": req.params.userid}, function (err, user) {
                if (user.length == 0) {
                    console.log('Errorrr');
                    resultado.status(404).send('Usuario no encontrado');
                }
                else {
                    token.remove({"_id": req.params.userid},function (err, user) {
                        if (err)
                            resultado.status(500).send('Internal server error');
                        else {
                            resultado.status(200).send('Saliendo de SocialDrone...');
                        }
                    });
                }
            });
        }
    };
    getUserS= function (req, res, next) {
        var resultado = res;
        usuario.findOne({"id_facebook": req.params.user_id}, {}, function (err, user) {
            if (user == null){
                resultado.status(404).send('No existe el usuario');
            }
            else   if (err)
                res.send(500,err.message);
            else
                res.status(200).json(user); // devuelve todos los Users en JSON
        });
    };
    var filename;
    uploadPhoto= function (req, res) {

    };

    getUserByUsername = function (req,res){
        var userName = req.params.username;
        console.log(userName);
        usuario.findOne({"username": userName},function (err, data) {
           if(data==null)
               res.status(404).send('Not found');
            else 
               res.status(200).json(data);
        })
    };

    //endpoints
    app.post('/users',multipartMiddleware, addUser);
    app.delete('/users/:username', deleteUser);
    app.get('/users', getUsers);
    app.get('/users/:user_id',jwtoken, getUser);
    app.get('/usersS/:user_id',jwtoken, getUserS);
    app.put('/users/:userName', updateUser);
    app.post('/users/login', loginUser);
    app.post('/authenticate', loginToken);
    app.delete('/authenticate/:userid',jwtoken, logout);
    app.post('/users/photo', uploadPhoto);
    app.get('/api/user/:username', getUserByUsername)


};
