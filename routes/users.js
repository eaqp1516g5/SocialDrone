/**
 * Created by bernat on 13/04/16.
 */
//Funciones backend para el usuario
var jwt    = require('jsonwebtoken');
module.exports = function (app) {

    var usuario = require('../models/user.js');
    var token = require('../models/authToken.js');
    var jwtoken = require('../config/jwtauth.js');
    var username;

    getUsers= function (req, res, next) {
        var resultado = res;
        usuario.find({}, {username:1, mail: 1, name: 1, lastname:1, createdAt:1, role:1}, function (err, users) {

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
        console.log("hola");
        console.log(req.params.user_id)
        usuario.findOne({"_id": req.params.user_id}, {username:1, mail: 1, name: 1, lastname:1, createdAt:1, role:1}, function (err, user) {
            if (user == null){
                resultado.status(404).send('No existe el usuario');
            }
            else   if (err)
                res.send(500,err.message);
            else
                res.status(200).json(user); // devuelve todos los Users en JSON
        });
    };
    addUser= function(req, res, next){

        var resultado = res;
        if (!req.body.username || !req.body.name ||!req.body.lastname || !req.body.password || !req.body.mail ) {
            res.status(400).send('Bad request');
        }
        else{
            usuario.find({username: req.body.username}, function (err, user) {
                if (user.length!=0){
                    resultado.status(409).send('Username already exists');
                }

                else {
                    var newUser = new usuario ({
                        username: req.body.username,
                        name: req.body.name,
                        lastname: req.body.lastname,
                        password: req.body.password,
                        mail: req.body.mail

                    });
                    newUser.save(function(err){
                        if (err) res.status(500).send('Internal server error');
                        else res.status(200).json(newUser);

                    })
                }
            });

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
            res.status(400).send('You must especify the username');
        else {
            usuario.find({"username": req.body.username}, function (err, user) {
                if (user.length == 0) {
                    resultado.status(404).send('Usuario no encontrado');
                    return resultado.status(404).jsonp({"loginSuccessful": false, "username": req.body.username });
                }
                else {
                    console.log(user[0].password);
                    if(user[0].password==req.body.password){
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
                    if (user.password != req.body.password) {
                        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                    } else {
                        var Token = jwt.sign(user, 'zassssssssssss', {
                            expires: Math.round((new Date().getTime()/1000)) + 60});
                        console.log(Math.round((new Date().getTime()/1000)) + 60)
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
    //endpoints
    /*app.use(function (req, res) {
        var token = req.headers['x-access-token'];
        if (token) {

        }
        else   
            return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    })*/
    app.post('/users', addUser);
    app.delete('/users/:username', deleteUser);
    app.get('/users',jwtoken, getUsers);
    app.get('/users/:user_id',jwtoken, getUser);
    app.put('/users/:userName', updateUser);
    app.post('/users/login', loginUser);
    app.post('/authenticate', loginToken)


};