var fs = require('fs');
module.exports = function (app) {
    var event = require('../models/event.js');
    var user = require('../models/user.js');
    var follow = require('../models/follow.js');
    var notification = require('../models/notification.js');
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
                createdby: req.body.userid,
                loc: req.body.location
        });
                    newevent.go.push(req.body.userid);
                    newevent.save(function (err) {
                        if (err) res.status(500).send('Internal server error');
                    })
            follow.findOne({userid: req.body.userid}).exec(function(err, foll){
                if(err){}
                else if (foll!=undefined){
                for(var i = 0;i<foll.follower.length;i++){
                    var notify = new notification({
                        userid: foll.follower[i],
                        type: 4,
                        actionuserid: req.body.userid,
                        text: "create new event",
                        idnotification: newevent._id
                    });
                    notify.save(function (err) {
                        if (err)res.status(500).send('Internal server error');
                    });
                }
                }
            })
                    res.json(newevent);
        }
    };
    getevento=function(req,res){
        event.findById(req.params.id).populate('createdby').exec(function(err, resp){
            console.log(resp);
            if(err){
                res.send(err);
            }
            else res.json(resp);
        })
    };
    getgoes=function(req,res){
        event.findById(req.params.id).populate('go').exec(function(err, resp){
            if(err){
                res.send(err);
            }
            else res.json(resp.go);
        })
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
    };
    goto = function(req,res){
        var go = false;
        console.log(req.params.eventid);
        console.log(req.params.id);
        event.findById(req.params.eventid).populate('createdby').exec(function(err,event){
            if(err) res.send(err);
            if(event==undefined){
                res.status(404).send("Event not found");
            }
            else {
                for(var i=0; i< event.go.length; i++){
                    if (event.go[i]==req.body.userid){
                        go = true;
                    }
                }
                if(go!=true){
                    event.go.push(req.body.userid);
                    event.save(function(err,rre){
                        if(err) res.send(err)
                    })
                    res.json(event);
                }
                else
                    res.status(400).send("You alredy go");
            }
        })
    };
    dontgoto = function(req,res){
        var go = false;
        console.log(req.params.eventid);
        event.findOne({_id: req.params.eventid}).exec(function(err,evento){
            if(evento==undefined){
                res.status(404).send("Event not found");
            }
            else if(err)
                res.send(err);
            else {
                for(var i=0; i< evento.go.length; i++){
                    if (evento.go[i]==req.body.userid){
                        go = true;
                    }
                }
                if(go==true) {
                    evento.update({$pull: {go: req.body.userid}}).exec(function(err,a){
                        if(err) res.send(err);
                    });
                    event.findOne({_id: req.params.eventid}).populate('createdby').exec(function(err,even) {
                        if(err) res.send(err);
                        else {
                            res.json(even);
                        }
                    });
                }
                else res.status(400).send("You're not here");
            }
        })
    };
    app.post('/goto/delete/:eventid',jwtoken, dontgoto);
    app.post('/event/:eventid',jwtoken, goto);
    app.post('/event',jwtoken, addEvent);
    app.post('/events', getEvent);
    app.get('/event/:id', getevento);
    app.get('/eve/:id', getgoes);
};