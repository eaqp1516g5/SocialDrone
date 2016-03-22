var fs = require('fs');
module.exports = function (app) {
    var message = require('../models/message.js');

    addMessage= function(req, res, next){
        if (!req.body.text) {
            res.status(400).send('Wrong data');
        }
        else{

            var messag = new message ({
                username: req.body.username,
                text: req.body.text
            })

            console.log(messag);
            messag.save(function(err){
                if (err) res.status(500).send('Internal server error');
                else res.json(messag);

            })
        }


    }

    //hacemos un get de los mensajes registrados en la DB
    //los campos que nos devuelve a 1
    getMessage = function (req, res) {
        if(req.params.message_id != undefined)
        message.find({"_id": req.params.message_id}, {username: 1, text: 1, like: 1, Date: 1}, function(err, messag) {
            if(err) res.send(err);
            res.json(messag);
        })
        else
        message.find({}, {username: 1, text: 1, like: 1, Date: 1}, function (err, messag) {
                if (err)res.send(err);
                res.json(messag); // devuelve todos los mensajes en JSON
            }
        );
    };
    //Eliminamos el mensaje con cierta id.
    deleteMessage = function (req, res) {
        message.remove({"_id": req.params.message_id},
            function(err){
                if(err){
                    res.send(err);
                }
            });
        res.send("ok");
    }


    app.post('/message', addMessage);
    app.get('/message\?/(:message_id)?', getMessage);
    app.delete('/message/:message_id', deleteMessage);
}