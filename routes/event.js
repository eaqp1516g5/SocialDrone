var fs = require('fs');
module.exports = function (app) {
    var event = require('../models/event.js');
    var user = require('../models/user.js');
    var jwt    = require('jsonwebtoken');
    var jwtoken = require('../config/jwtauth.js');
    var moment = require('moment');
    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb://localhost/SocialDroneDB';
    addEvent = function (req, res, next) {
        console.log(req.body)
        if (!req.body.name || !req.body.description) {
            res.status(400).send('Wrong data');
        }
        else {
            var newDate= moment(req.body.Date).format('LL');
            var fecha=new Date();
            var dat = new Date(req.body.Date);
            console.log(dat);
            console.log(req.body.location);
            if(dat<fecha)
                res.status(400).send("You don't put a date minor than now");
            var newevent = new event({
                name: req.body.name,
                description: req.body.description,
                lat: req.body.lat,
                long: req.body.long,
                Date: req.body.Date,
                hour: req.body.hour,
                day:  newDate,
                loc: req.body.location
        });
                    newevent.save(function (err) {
                        if (err) res.status(500).send('Internal server error');
                    })
                    res.json(newevent);
        }
    };
    getevento=function(req,res){
        evento.findByid(req.params.id).exec(function(err, res){
            if(err){
                res.send(err);
            }
            else res.json(res);
        })
    }
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
        var radius = req.body.radius*1000;
        var lat = req.body.lat;
        var lng = req.body.lng;
        var evento=[];
        MongoClient.connect(url, function(err,db){
            findplaces(db, function(){
                db.close();
            })
        })
        var findplaces=function(db, callback){
            var cursor = db.collection('events').find({loc: {$near: {$geometry:{type: 'Point', coordinates: [lng,lat]},$maxDistance:radius}}});
            cursor.each(function(err,doc){
                if(doc!=null) {
                    evento.push(doc);
                }
                else  res.json(evento);

            })
        }
    }
    app.post('/event', addEvent);
    app.post('/events', getEvent)
    app.get('/event/:id', getevento);
};