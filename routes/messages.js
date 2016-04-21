/**
 * Created by bernat on 20/04/16.
 */

var fs = require('fs');
module.exports = function (app) {
    var message = require('../models/message.js');
    var comment = require('../models/comment.js');

    addMessage = function (req, res, next) {
        if (!req.body.text) {
            res.status(400).send('Wrong data');
        }
        else {
            var messag = new message({
                username: req.body.username,
                text: req.body.text,
                like: 0
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
            message.findOne({_id: req.params.message_id}).populate('comment').exec(function(err,story){
                if(err) res.send(err);
                else res.json(story);
            })
        }

        else{
            message.find({}, {username: 1, text: 1, like: 1, Date: 1, comment: 1}, function (err, messag) {
                if (err)res.send(err);
                res.json(messag); // devuelve todos los mensajes en JSON
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
    app.post('/message/:message_id/like', likeMessage);
    app.post('/message', addMessage);
    app.get('/message\?/(:message_id)?', getMessage);
    app.delete('/message/:message_id', deleteMessage);
    app.put('/message/:message_id', updateMessage);
};