/**
 * Created by bernat on 21/04/16.
 */
var UserModel = require('../models/user');
var jwt    = require('jsonwebtoken');
var tokens = require('../models/authToken.js');

module.exports = function(req, res, next) {
    // code goes here
    var tokenUser = req.body.token || req.query.token || req.headers['x-access-token'];
    if (tokenUser!=undefined) {
        console.log('Tenemos token');
        tokens.findOne({"token":tokenUser}, function (err, data) {
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
