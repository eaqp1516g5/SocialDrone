/**
 * Created by bernat on 10/03/16.
 */

var fs = require('fs');
module.exports = function (app) {

    var usuario = require('../models/user.js');

    addUser= function(req, res, next){
        if (!req.body.username || !req.body.password) {
            res.status(400).send('Wrong data');
        }
        else{

            var user = new usuario ({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                gender: req.body.gender,
                address: req.body.address
            })

            console.log(user);
            user.save(function(err){
                if (err) res.status(500).send('Internal server error');
                else res.status(200).send('OK');

            })
        }


    }


    //hacemos un get de los usuarios registrados en la DB
    //los campos que nos devuelve a 1
    getUsers = function (req, res) {
        usuario.find({}, {username: 1, email: 1, gender: 1, address: 1}, function (err, users) {
                if (err)
                    res.send(err)
                res.json(users); // devuelve todos los Users en JSON
            }
        );
    };
    deleteUser = function (req, res) {
        usuario.remove({"_id": req.params.user_id},
            function(err){
                if(err){
                    res.send(err);
                }
            });
        res.send("ok");
    }


    app.post('/users', addUser);
    app.get('/users', getUsers);
    app.delete('/user/:user_id', deleteUser);
}



