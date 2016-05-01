var fs = require('fs');
module.exports = function (app) {
    var event = require('../models/event.js');
    var user = require('../models/user.js');
    var jwt    = require('jsonwebtoken');
    var jwtoken = require('../config/jwtauth.js');

    addEvent = function (req, res, next) {
        if (!req.body.name || !req.body.description) {
            res.status(400).send('Wrong data');
        }
        else {
            var dat = new Date(req.body.Date);
            var newevent = new event({
                name: req.body.name,
                description: req.body.description,
                lat: req.body.lat,
                long: req.body.long,
                Date: req.body.Date,
                hour: req.body.hour,
                day:  ("0" + (dat.getDay()+1)).slice(-2)  + "/" + ("0" + (dat.getMonth()+1)).slice(-2) + "/" + dat.getFullYear()
            });
                    newevent.save(function (err) {
                        if (err) res.status(500).send('Internal server error');
                    })
                    res.json(newevent);
        }
    };

    app.post('/event', addEvent);
};