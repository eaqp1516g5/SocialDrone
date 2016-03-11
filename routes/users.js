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
    app.post('/users', addUser);
}

