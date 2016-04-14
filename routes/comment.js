var fs = require('fs');
module.exports = function (app) {
    var message = require('../models/message.js');
    var comment = require('../models/comment.js');

    addComment = function (req, res, next) {
        if (!req.body.text) {
            res.status(400).send('Wrong data');
        }
        else {
            var newcomment = new comment({
                username: req.body.username,
                text: req.body.text,
                like: 0
            });
            message.findById(req.params.message_id, function(err, message) {
                if (message == undefined)
                    res.status(404).send("No se ha encontrado el mensaje");
                else {
                    newcomment.save(function (err) {
                        if (err) res.status(500).send('Internal server error');
                    })
                    message.comment.push(newcomment._id);
                    message.save();
                    if (err) res.send(err);
                    res.json(message);
                }})
        }
    };
    getComment = function (req, res) {
        var resultado = res;
            comment.find({}, {username: 1, text: 1, like: 1, Date: 1}, function (err, messag) {
                if (messag.length == 0) {
                    resultado.status(404).send('Mensaje no encontrado');
                }
                else if (err) res.send(err);
                else res.json(messag);
            });
    };
    //Eliminamos el comentario con cierta id.
    deleteComment = function (req, res) {
        var resultado = res;
        message.findOneAndUpdate({_id:req.params.message_id},{$pull: {comment: req.params.comment_id}}, function (err, messag) {
            if (messag == undefined) {
                resultado.status(404).send('Mensaje no encontrado');
            }
            else if (err)
                res.send(err)
            else {
                comment.remove({"_id": req.params.comment_id}, function (err, comm) {
                    if (comm == undefined) {
                        resultado.status(404).send('Comentario no encontrado');
                    }
                    else if (err)
                        res.send(err);
                    else
                        res.status(200).send("Mensaje borrado correctamente");
                });
                    }

        })
    };
    likeComment = function(req, res, next){
        comment.findByIdAndUpdate(req.params.comment_id, {'$inc': {like: 1}}, function (err, comment) {
            if (err) res.send(err);
            else res.json(comment);
        })
    };
    app.post('/comment/:comment_id/like', likeComment);
    app.get('/comment', getComment);
    app.post('/comment/:message_id', addComment);
    app.delete('/comment/:message_id/:comment_id', deleteComment);
};