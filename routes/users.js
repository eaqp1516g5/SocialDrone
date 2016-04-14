/**
 * Created by bernat on 13/04/16.
 */
//Funciones backend para el usuario
module.exports = function (app) {

    var usuario = require('../models/user.js');
    var username;

    getUsers= function (req, res, next) {
        var resultado = res;
        usuario.find({}, {username:1, mail: 1, password: 1, name: 1, lastname:1, createdAt:1, role:1}, function (err, users) {

            if (users.length ==0){
                resultado.status(404).send('No hay usuarios');
            }

            else   if (err)
                res.send(500,err.message);
            else
                res.status(200).json(users); // devuelve todos los Users en JSON
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

    //endpoints

    app.post('/users', addUser);
    app.delete('/users/:username', deleteUser);
    app.get('/users', getUsers);
    app.put('/users/:userName', updateUser);

};