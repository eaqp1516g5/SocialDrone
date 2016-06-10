/**
 * Created by Admin on 23/04/2016.
 */
var fs = require('fs');
module.exports = function (app) {
    var hashtag = require('../models/Hashtag.js');
    var message = require('../models/message.js');
    var comment = require('../models/comment.js');
    var user = require('../models/user.js');
    var jwt = require('jsonwebtoken');
    var jwtoken = require('../config/jwtauth.js');
    var notification = require('../models/notification.js');
    var moment = require('moment');
    var date = new Date();


    addMessage = function (req, res, next) {
        console.log("entramos aqui *****************");
        console.log(date);
        var newDate = moment(date).format('MMMM Do YYYY, h:mm:ss a');
        console.log("entramos aqui *****************");
        console.log(newDate);
        if (!req.body.text) {
            res.status(400).send('Wrong data');
        }
        else {

            var spl3 = [];
            var spl = req.body.text.split("#");
            if (spl.length > 0) {
                for (var i = 1; i < spl.length; i++) {
                    var spl2 = spl[i].split(" ")
                    spl3.push(spl2[0]);
                    console.log(spl2[0]);
                }
            }
            var mensaje = req.body.text;
            console.log("spl3");
            console.log(spl3);

            for (var i = 0; i < spl3.length; i++) {
                console.log("estoy aqui PP" + spl3[i]);
                console.log("estoy aqui PP1" + mensaje);

                var spl4 = mensaje.split("#" + spl3[i]);
                mensaje = spl4[0] + "<a href='/hashtags" + spl3[i] + "' >#" + spl3[i] + "</a>" + spl4[1];
            }
            console.log(mensaje);
            var messag = new message({
                username: req.body.username,
                text: mensaje,
                like: 0,
                createdAt: newDate
            });
            console.log(messag);
            messag.save(function (err) {
                if (err) res.status(500).send('Internal server error');
                else {
                    for (var i = 0; i < spl3.length; i++) {
                        console.log("punta del nabo");
                        hashtag.findOneAndUpdate({
                            hash: spl3[i]
                        }, {
                            hash: spl3[i],
                            $push: {"text": messag._id}
                        }, {
                            upsert: true
                        }, function (error, resultado) {
                            console.log(error);
                            console.log(resultado);
                        })
                    }
                    res.json(messag);
                }

            })

        }
    };
    //hacemos un get de los mensajes registrados en la DB
    //los campos que nos devuelve a 1
    getMessage = function (req, res) {
        var resultado = res;
        var page = req.params.page;
        console.log(req.params.message_id);
        console.log(page);
        if (req.params.message_id != undefined) {
            message.findOne({_id: req.params.message_id}).populate('comment').populate('username').exec(function (err, story) {
                if (err) res.send(err);
                else res.json(story);
            })
        }

        else {
            message.find({}, {
                username: 1,
                text: 1,
                like: 1,
                Date: 1,
                comment: 1,
                createdAt: 1
            }).populate('username').sort({Date: -1}).exec(function (err, messag) {
                if (err)res.send(err);
                else  res.json(messag); // devuelve todos los mensajes en JSON
            });
        }
    }
    //eliminamos el mensaje con cierta id.
    deleteMessage = function (req, res) {
        console.log('lleeeeeegooooo');
        var resultado = res;
        console.log('borroooo el mensajeeeee' + req.params.message_id);
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
    likeMessage = function (req, res, next) {
        message.findByIdAndUpdate(req.params.message_id, {$inc: {like: 1}}, function (err, message) {
            if (message == undefined)
                res.status(404).send('No se ha encontrado el mensaje');
            else {
                console.log(req.body.userid);
                notification.findOne({
                    idnotification: req.params.message_id,
                    userid: message.username,
                    type: 2,
                    actionuserid: req.body.userid
                }).exec(function (err, res) {
                    if (err) console.log("Falla");
                    else if (res != undefined) {
                    }
                    else {
                        var notify = new notification({
                            userid: message.username,
                            type: 2,
                            actionuserid: req.body.userid,
                            text: "likes your message",
                            idnotification: req.params.message_id
                        })
                        notify.save(function (err) {
                            if (err)res.status(500).send('Internal server error');
                        })
                    }
                })
                message.save();
                if (err) res.send(err);
                res.json(message);
            }
        })
    };
    updateMessage = function (req, res) {
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
    getMessagesUser = function (req, res) {
        var userid = req.params.userid;
        console.log(userid);
        message.find({"username": userid}, function (err, messages) {
            console.log(messages);
            res.status(200).json(messages);
        })
    };

    getMessagePagination = function (req, res) {
        var page = req.params.page;

        message.find({"username": req.params.userid}, {
            username: 1,
            text: 1,
            like: 1,
            Date: 1,
            comment: 1,
            createdAt: 1
        }).populate('username').sort({Date: -1}).skip(page).limit(2).exec(function (err, messag) {
            res.status(200).json(messag)
        });
    };
    getPagMessage = function (req, res) {
        var pages;
        if (req.params.page == undefined)
            res.status(400).send("Page needed");
        else {
            message.find().exec(function (err, messag) {
                if (err) {
                    res.status(500).send(err);
                }
                else pages = messag.length;
            })
            message.find({}).populate('username').sort({Date: -1}).skip(req.params.page * 5).limit(5).exec(function (err, message) {
                if (err) {
                    res.status(500).send(err);
                }
                else if (message.length == 0) res.status(404).send("Not found");
                else res.send({data: message, pages: pages});
            })
        }
    }
    getmensajehashtag = function (req, res) {
        var hash = req.params.hash;
        var aaaa = [];
        var ids = [];
        var p = 0;

        hashtag.findOne({hash: hash}, function (err, data) {
            ids = data.text.split(",");
            for (var a = 0; a < ids.length; a++) {
                message.findOne({_id: ids[a]}, function (err, data2) {
                    aaaa.push((data2));
                    p++;
                    console.log(p + "-" + ids.length)
                    if (p == ids.length)
                        res.json(aaaa);
                })
            }

        });


    }


    app.get('/hashtags/:hash', getmensajehashtag);
    app.post('/message/:message_id/like', jwtoken, likeMessage);
    app.post('/message', jwtoken, addMessage);
    app.get('/message/user/:userid', getMessagesUser);
    app.get('/message\?/(:message_id)?', getMessage);
    app.delete('/message/:message_id', jwtoken, deleteMessage);
    app.put('/message/:message_id', jwtoken, updateMessage);
    app.get('/message/user/:userid/page=:page', getMessagePagination)
    app.get('/messages/pag=:page', getPagMessage);
}
;