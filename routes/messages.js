/**
 * Created by Admin on 23/04/2016.
 */
var fs = require('fs');
module.exports = function (app) {
    var message = require('../models/message.js');
    var comment = require('../models/comment.js');
    var user = require('../models/user.js');
    var jwt    = require('jsonwebtoken');
    var jwtoken = require('../config/jwtauth.js');
    var notification = require('../models/notification.js');
    var moment = require('moment');
    var date = new Date();


    addMessage = function (req, res, next) {
        console.log("entramos aqui *****************");
        console.log(date);
        var newDate= moment(date).format('MMMM Do YYYY, h:mm:ss a');
        console.log("entramos aqui *****************");
        console.log(newDate);
        if (!req.body.text) {
            res.status(400).send('Wrong data');
        }
        else {
            var messag = new message({
                username: req.body.username,
                text: req.body.text,
                like: 0,
                createdAt: newDate
            });

            console.log(messag);
            messag.save(function (err) {
                if (err) res.status(500).send('Internal server error');
                else res.json(messag);

            })
        }
    };
    //hacemos un get de los mensajes registrados en la DB
    //los campos que nos devuelve a 1
    getMessage = function (req, res) {
        var resultado = res;
        if (req.params.message_id != undefined) {
            message.findOne({_id: req.params.message_id}).populate('comment').populate('username').exec(function(err,story){
                if(err) res.send(err);
                else res.json(story);
            })
        }

        else{
            message.find({}, {username: 1, text: 1, like: 1, Date: 1, comment: 1, createdAt: 1}).populate('username').sort({Date:-1}).exec(function (err, messag) {
                if (err)res.send(err);
                else  res.json(messag); // devuelve todos los mensajes en JSON
            });
        }
    }
    //eliminamos el mensaje con cierta id.
    deleteMessage = function (req, res) {
        var resultado = res;
        message.find({"_id": req.params.message_id}, function (err, messag) {
            if (messag.length == 0) {
                resultado.status(404).send('Mensaje no encontrado');
            }

            else {
                message.remove({"_id": req.params.message_id},
                    function (err) {
                        if (err) {
                            res.send(err);
                        }
                        else {
                            res.status(200).send("Mensaje borrado correctamente");
                        }
                    });
            }
        });
    };
    likeMessage = function(req, res, next){
        message.findByIdAndUpdate(req.params.message_id,{ $inc: { like: 1} }, function(err, message) {
            if (message == undefined)
                res.status(404).send('No se ha encontrado el mensaje');
            else {
                console.log(req.body.userid);
                notification.findOne({userid: message.username, type: 2, actionuserid: req.body.userid}).exec(function(err,res){
                    if(err) console.log("Falla");
                    else if(res!=undefined){}
                    else {
                        var notify = new notification({
                            userid: message.username,
                            type: 2,
                            actionuserid: req.body.userid,
                            text: "likes your message"
                        })
                        notify.save(function (err) {
                            if (err)res.status(500).send('Internal server error');
                        })
                    }
                })
                message.save();
                if (err) res.send(err);
                res.json(message);
            } })
    };
    updateMessage= function (req, res) {
        var resultado = res;
        if (!req.params.message_id)
            res.status(400).send('You must especify the message');
        else {
            message.find({"_id": req.params.message_id}, function (err, messag) {
                if (messag.length == 0) {
                    resultado.status(404).send('Usuario no encontrado');
                }
                else {
                    message.findOneAndUpdate({"_id": req.params.message_id}, req.body, {upsert: true}, function (err, mess) {

                        if (err)
                            resultado.status(409).send('Mensaje no encontrado');

                        else {
                            resultado.status(200).json(mess);
                        }

                    });
                }

            });
        }
    };
    getMessagesUser= function (req,res) {
        var userid = req.params.userid;
        console.log(userid);
        message.find({"username":userid}, function (err, messages) {
            console.log(messages);
            res.status(200).json(messages);
        })
    };
    app.post('/message/:message_id/like',jwtoken, likeMessage);
    app.post('/message',jwtoken, addMessage);
    app.get('/message/user/:userid',getMessagesUser);
    app.get('/message\?/(:message_id)?', getMessage);
    app.delete('/message/:message_id',jwtoken, deleteMessage);
    app.put('/message/:message_id',jwtoken, updateMessage);


};