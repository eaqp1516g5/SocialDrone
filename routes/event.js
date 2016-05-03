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
            var fecha=new Date();
            var dat = new Date(req.body.Date);
            console.log(dat);
            console.log(fecha);
            if(dat<fecha)
                res.status(400).send("You don't put a date minor than now");
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

    getEvent = function (req, res) {
        var fecha = new Date();
            event.find({}).exec(function(err, eve){
                if(err) res.send(err);
                for(var i=0; i < eve.length; i++){
                    var date = new Date(eve[i].Date);
                    if(date<fecha){
                        eve[i].remove();
                    }
                }
            });
            event.find( {$and: [ {$and:[{ lat: { $gt: req.body.lat2 } }, { lat: { $lt: req.body.lat1 } }]},{$and:[{ long: { $gt: req.body.lng2 } }, { long: { $lt: req.body.lng1 } }]} ]}).exec(function(err,story){
                if(err) res.send(err);
                else res.json(story);
            })
    }
    app.post('/event', addEvent);
    app.post('/events', getEvent)

};