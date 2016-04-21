/**
 * Created by bernat on 21/04/16.
 */
var UserModel = require('../models/user');
var jwt    = require('jsonwebtoken');
var token = require('../models/authToken.js');

module.exports = function(req, res, next) {
    // code goes here
    console.log('Llego');
    var tokenUser = req.body.token || req.query.token || req.headers['x-access-token'];
    console.log(tokenUser);
    if (tokenUser!=undefined) {
        console.log('Tenemos token');
        token.findOne({"token":tokenUser}, function (err, data) {
            if(err)
                throw err;
            else if(data==undefined)
                res.send('Token no válido');
            else 
                next();
        })
    }
    else {
        console.log('No tenemos');
        res.send('No tengo tokencito');
    }
    };
