/**
 * Created by bernat on 10/03/16.
 */

var fs = require('fs');
var crypto = require('crypto');
module.exports = function (app) {

    var usuario = require('../models/user.js');
    var username;


    addUser= function(req, res, next){
        var resultado = res;
        if (!req.body.username || !req.body.name ||!req.body.lastname || !req.body.password || !req.body.mail) {
            res.status(400).send('Wrong data');
        }
        else{
            var passHash = crypto.createHash('SHA1').update(req.body.password).digest('hex');
            req.body.password = passHash;
            username = req.body.username;
            usuario.find({username: username}, function (err, user) {
                if (user.length!=0){
                    resultado.status(409).send('Username already exists');
                }

                else {
                    var user = new usuario ({
                        username: req.body.username,
                        name: req.body.name,
                        lastname: req.body.lastname,
                        password: passHash,
                        mail: req.body.mail,
                        role : req.body.role
                    });

                    console.log(user);
                    user.save(function(err){
                        if (err) res.status(500).send('Internal server error');
                        else res.status(200).json(user);

                    })
                }
            });

        }
    };
    //hacemos un get de los usuarios registrados en la DB
    //los campos que nos devuelve a 1
    getUsers = function (req, res) {
        var resultado = res;
        usuario.find({}, {username:1, email: 1, password: 1, name: 1, lastname:1}, function (err, users) {

                if (users.length ==0){
                    resultado.status(404).send('No hay usuarios');
                }

            else    if (err)
                    res.send(500,err.message);
            else
                res.status(200).json(users); // devuelve todos los Users en JSON
            });
    };

    //Eliminar usuario por ID
    deleteUser = function (req, res) {
        var resultado = res;
        usuario.find({"_id": req.params.user_id}, function (err, user) {
            if (user.length == 0) {
                resultado.status(404).send('Usuario no encontrado');
            }

            else{
                usuario.remove({"_id": req.params.user_id},
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
    updateUser= function (req, res) {
        var resultado = res;
    };


    //endpoints
    app.post('/users', addUser);
    app.get('/users', getUsers);
    app.delete('/users/:user_id', deleteUser);
    app.put('/users', updateUser);
}





