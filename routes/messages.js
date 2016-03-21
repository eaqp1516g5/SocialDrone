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
<<<<<<< HEAD
        var resultado = res;
        if(req.params.message_id != undefined)

        message.find({"_id": req.params.message_id}, {username: 1, text: 1}, function(err, messag) {
            if (messag.length == 0) {
                resultado.status(404).send('Mensaje no encontrado');
            }
            else if(err) res.send(err);
            else res.json(messag);
=======
        if(req.params.message_id != undefined)
        message.find({"_id": req.params.message_id}, {username: 1, text: 1}, function(err, messag) {
            if(err) res.send(err);
            res.json(messag);
>>>>>>> origin/bernat-dev
        })
        else
        message.find({}, {username: 1, text: 1}, function (err, messag) {
                if (err)res.send(err);
                res.json(messag); // devuelve todos los mensajes en JSON
            }
        );
    };
    //Eliminamos el mensaje con cierta id.
    deleteMessage = function (req, res) {
<<<<<<< HEAD
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
    }

=======
        message.remove({"_id": req.params.message_id},
            function(err){
                if(err){
                    res.send(err);
                }
            });
        res.send("ok");
    }


>>>>>>> origin/bernat-dev
    app.post('/message', addMessage);
    app.get('/message\?/(:message_id)?', getMessage);
    app.delete('/message/:message_id', deleteMessage);
}