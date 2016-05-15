/**
 * Created by Admin on 14/05/2016.
 */
var notification = require('../models/notification.js');
var jwtoken = require('../config/jwtauth.js');
var mongoose = require('mongoose');
module.exports = function (app) {
    getNotifications = function(req,res){
        var pages;
        if (req.params.page == undefined)
            res.status(400).send("Page needed");
        else if (req.headers.userid==undefined){
            res.status(404).send("User doesn't found");
        }
        else{
            notification.find({userid: req.headers.userid}).exec(function(err, notify){
                if(err) {
                    res.status(500).send(err);
                }
                else pages=notify.length;
            })
            notification.find({userid: req.headers.userid}).populate('userid').populate('actionuserid').sort({date:-1}).skip(req.params.page).limit(5).exec(function(err, notify){
                if(err) {
                    res.status(500).send(err);
                }
                else res.send({data: notify, pages: pages});
            })
        }
    };
    getNotificationsType = function(req,res){
        var pages;
        if (req.params.page == undefined)
            res.status(400).send("Page needed");
        else if (req.headers.userid==undefined){
            res.status(404).send("User doesn't found");
        }
        else{
            notification.find({userid: req.headers.userid, type: req.params.type}).exec(function(err, notify){
                if(err) {
                    res.status(500).send(err);
                }
                else pages=notify.length;
            })
            notification.find({userid: req.headers.userid, type: req.params.type}).populate('userid').populate('actionuserid').sort({date:-1}).skip(req.params.page).limit(5).exec(function(err, notify){
                if(err) {
                    res.status(500).send(err);
                }
                else res.send({data: notify, pages: pages});
            })
        }
    };
    deleteNotification = function(req, res){
        if (req.params.id == undefined)
            res.status(400).send("Id needed");
        else if (req.headers.userid==undefined){
            res.status(404).send("User doesn't found");
        }
        else{
            notification.findOne({userid: req.headers.userid, _id: req.params.id}).exec(function(err, notify){
                if(err) {
                    res.status(500).send(err);
                }else if(notify==undefined){
                    res.status(404).send("Notification doesn't exist.")
                }
                else {
                    notify.remove(function(err){
                        if(err) res.status(500).send(err);
                        else res.send("Deleted");
                    }
                    )
                }
            })
        }
    };
    deleteall=function(req,res){
        if (req.headers.userid==undefined){
            res.status(404).send("User doesn't found");
        }
        else{
            notification.find({userid: req.headers.userid}).exec(function(err, notify){
                if(err) {
                    res.status(500).send(err);
                }else if(notify==undefined){
                    res.status(404).send("Notification doesn't exist.")
                }
                else {
                    for(var i=0; i < notify.length; i++){
                    notify[i].remove(function(err){
                            if(err) res.status(500).send(err);
                        }
                    )
                };
                res.send("Deleted");
                }
            })
        }
    }
    deletethis=function(req,res){
        if (req.headers.userid==undefined){
            res.status(404).send("User doesn't found");
        }
        else{
        notification.find({userid: req.headers.userid}).skip(req.params.page).limit(5).sort({date:-1}).exec(function(err, notify){
            console.log("GOlllllll");
            if(err) {
                res.status(500).send(err);
            }else if(notify==undefined){
                res.status(404).send("Notification doesn't exist.")
            }
            else {
                console.log("Aqui");
                console.log(notify[0]);
                for(var i=0; i < notify.length; i++){
                    notify[i].remove(function(err){
                            if(err) res.status(500).send(err);
                        }
                    )
                };
                res.send("Deleted");
            }
        });
        }
    }
    app.get('/notifications/page=:page', jwtoken, getNotifications);
    app.get('/notifications/type=:type/page=:page', jwtoken, getNotificationsType);
    app.delete('/notifications/:id', jwtoken, deleteNotification);
    app.delete('/notifications/dele/all', jwtoken, deleteall);
    app.delete('/notifications/delete/page=:page', jwtoken, deletethis);
};