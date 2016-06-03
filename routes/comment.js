var fs = require('fs');
module.exports = function (app) {
    var message = require('../models/message.js');
    var comment = require('../models/comment.js');
    var notification = require('../models/notification.js');
    var user = require('../models/user.js');
    var jwt    = require('jsonwebtoken');
    var jwtoken = require('../config/jwtauth.js');

    addComment = function (req, res, next) {
        if (!req.body.text) {
            res.status(400).send('Wrong data');
        }
        else {
            var newcomment = new comment({
                username: req.body.username,
                id: req.body.id,
                text: req.body.text,
                like: 0,
                imageUrl:req.body.imageUrl
            });
            message.findById(req.params.message_id).populate('username').exec(function(err, message) {
                if (err) res.send(err);
                else if (message == undefined)
                    res.status(404).send("No se ha encontrado el mensaje");
                else {
                    message.comment.push(newcomment._id)
                    message.save(function(err){
                        if(err) res.status(500).send('Internal server error');
                    });
                    newcomment.save(function (err) {
                        if (err) res.status(500).send('Internal server error');
                    })
                    var notify = new notification({
                        userid: message.username._id,
                        type: 0,
                        actionuserid: req.body.id,
                        text: "comment your message",
                        idnotification: message._id
                    })
                    notify.save(function(err){
                        if(err)res.status(500).send('Internal server error');
                    })
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
        message.findOneAndUpdate({_id: req.params.message_id},{$pull: {comment: req.params.comment_id}},function (err, messag){
            if (messag == undefined) {
                resultado.status(404).send('Mensaje no encontrado');
                console.log("gola");
            }
            else if (err)
                res.send(err)
            else {
                comment.remove({"_id": req.params.comment_id}, function (err, comm) {
                    if(comm == undefined){
                        resultado.status(404).send('No se ha encontrado ningun comentario');
                    }
                    else if(err)
                        res.send(err);
                    else
                        res.status(200).send("Comentario borrado");


                })
            }

        })
    };
    likeComment = function(req, res, next){
        comment.findByIdAndUpdate(req.params.comment_id, {'$inc': {like: 1}}, function (err, comment) {
            if (err) res.send(err);
            else{
                user.findOne({username: comment.username}).exec(function(err,res){{
                    if (err) console.log("Falla");
                    else if (res != undefined) {
                        var notify = new notification({
                            userid: res._id,
                            type: 3,
                            actionuserid: req.body.userid,
                            text: "likes your comment",
                            idnotification: req.body.idmes
                        })
                            notify.save(function (err) {
                                if (err)res.status(500).send('Internal server error');
                            })
                        }
                    }
                })
                res.json(comment);}
        })
    };
    app.post('/comment/:comment_id/like',jwtoken, likeComment);
    app.get('/comment', getComment);
    app.post('/comment/:message_id',jwtoken, addComment);
    app.delete('/comment/:message_id/:comment_id', jwtoken, deleteComment);
};