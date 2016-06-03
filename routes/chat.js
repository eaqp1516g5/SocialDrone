var mongoose = require('mongoose');
var chat = require('../models/chat.js');
var users = require('../models/user.js');
var seen = require('../models/isseen.js');
var chatMessage = require('../models/chatMessage.js');
var jwtoken = require('../config/jwtauth.js');

module.exports = function (app) {
    //Inicializamos chat
    initChat = function(req,res){
        if (req.body.user==undefined||req.body.userid==undefined){
            res.status(400).send('User to chat undefined');
        }
        else{
            var usario1;
            var newChat = new chat();
            newChat.users.push(req.body.user);
            newChat.users.push(req.body.userid);
            users.findOne({_id: req.body.user}).exec(function(err,us){
                if(err){
                    res.status(500).send('Internal server error');
                }
                else if(us==undefined){
                    res.status(404).send("User doesn't exists");
                }
                else{
                    usuario1=us.username;
                }
            });
            users.findOne({_id: req.body.userid}).exec(function(err,us){
                if(err){
                    res.status(500).send('Internal server error');
                }
                else if(us==undefined){
                    res.status(404).send("User doesn't exists");
                }
                else{
                    usuario1= usuario1 +','+us.username;
                }
            })
            chat.find({$and:[{users: req.body.userid}, {users: req.body.user}]}).exec(function(err, a){
            if(err){
                res.status(500).send('Internal server error');
            }
            else if(a!=undefined&& a[0].users.length==2){
                res.send(a[0]);
            }
            else{
            newChat.save(function(err){
                if(err)
                res.status(500).send('Internal server error');
                else {
                    var newsee = new seen({
                        user: req.body.userid,
                        usuarios: usuario1,
                        chat: newChat._id
                    });
                    var newsee2 = new seen({
                        user: req.body.user,
                        usuarios: usuario1,
                        chat: newChat._id
                    });
                    newsee.save(function(err){
                        if(err)
                            res.status(500).send('Internal server error');
                    });
                    newsee2.save(function(err){
                        if(err)
                            res.status(500).send('Internal server error');
                        else
                            res.send(newChat);
                    });
                }
            });
        }})}
    };
    //Add more users to the conversation.
    addUser = function(req,res){
        console.log(req.body.user);
        if (req.body.user==undefined||req.body.userid==undefined){
            res.status(400).send('User to chat undefined');
        }
        else if(req.body.conversation_id==undefined){
            res.status(400).send('Conversation not specified');
        }
        else{
            users.findOne({_id: req.body.user}).exec(function(err,us){
                if(err){
                    res.status(500).send('Internal server error');
                }
                else if(us==undefined){
                    res.status(404).send("User doesn't exists");
                }
                else{
                    usuario1=us.username;
                }
            })
            seen.findOne({user: req.body.userid,chat: req.body.conversation_id}).exec(function(err,se){
                if(err){
                    res.status(500).send('Internal server error');
                }
                else if(se==undefined){
                    res.status(404).send("Not found");
                }
                else {
                    usuario1=se.usuarios+','+usuario1;
                }
            })
            chat.findOne({_id: req.body.conversation_id, users: req.body.user}).exec(function(err, chateo){
                if(err){
                    res.status(500).send('Internal server error');
                }
                else if(chateo!=undefined){
                    res.status(409).send("User is on the conversation");
                }
            })
            chat.findOne({_id: req.body.conversation_id}).exec(function(err, chat){
                if(chat.users.indexOf(req.body.user)==-1) {
                    chat.users.push(req.body.user);
                }
                chat.save(function(err){
                    if(err)
                        res.status(500).send('Internal server error');
                    else {
                        var newsee = new seen({
                            user: req.body.user,
                            chat: req.body.conversation_id,
                            usuarios: usuario1
                        });
                        newsee.save(function(err){
                            if(err)
                                res.status(500).send('Internal server error');
                            else
                            {
                                for(var o=0;o<chat.users.length;o++){
                                    seen.findOneAndUpdate({chat: req.body.conversation_id, user: chat.users[o]},{usuarios: usuario1}).exec(function(err,rest){
                                        if(err){
                                            res.status(500).send('Internal server error');
                                        }
                                        else (rest!=undefined)
                                        {
                                            res.send('Chat initialize');
                                        }
                                    })
                                }
                            }
                        });}
                });
            })
        }
    };
    //buscamos chats del usuario
    getchats = function(req,res){
        var pages;
        if (req.params.page == undefined)
            res.status(400).send("Page needed");
        else if (req.headers.userid==undefined){
            res.status(404).send("User doesn't found");
        }
        else{
            seen.find({user: req.headers.userid}).exec(function(err,visto){
                if (err){res.status(500).send('Internal server error');}
                else{
                    console.log(visto.length);
                    pages=visto.length;
                    seen.find({user: req.headers.userid}).sort({date: -1}).skip(req.params.page*5).limit(5).exec(function(err,chatt){
                        if(err){res.status(500).send('Internal server error');}
                        else{
                            console.log(chatt);
                            res.send({data: chatt, pages: pages});
                        }
                    });
                }
            })
        }
    };
    //Obtenemos todas las conversaciones de un chat
    getConversation = function(req, res){
       if(req.params.id==undefined){
           res.status(400).send('Id not found');
       }
       else{
           chat.findOne({_id: req.params.id}).populate('users').exec(function(err, chate){
               if(err){
                   res.status(500).send('Internal server error');
               }
               else if(res==undefined){
                   res.status(404).send("Conversation doesn't found");
               }
               else{
                   chatMessage.find({chatid: req.params.id}).populate('user').populate('chatid').exec(function(err, chate){
                       res.send(chate);
                   })
               }
           })
       }
    };
    getChatsType = function(req,res){
        var pages;
        console.log(req.params.type);
        if (req.params.page == undefined)
            res.status(400).send("Page needed");
        else if (req.headers.userid==undefined){
            res.status(404).send("User doesn't found");
        }
        else{
            seen.find({user: req.headers.userid, visto: req.params.type}).exec(function(err,visto){
                if (err){res.status(500).send('Internal server error');}
                else{
                    pages=visto.length;
                    seen.find({user: req.headers.userid,visto: req.params.type}).sort({date: -1}).skip(req.params.page*5).limit(5).exec(function(err,chatt){
                        if(err){res.status(500).send('Internal server error');}
                        else{
                            res.send({data: chatt, pages: pages});
                        }
                    });
                }
            })
        }
    };
    app.post('/chatt', jwtoken, initChat);
    app.post('/chatt/user', jwtoken,addUser);
    app.get('/chatt/type=:type/page=:page', jwtoken, getChatsType);
    app.get('/chatt/page=:page', jwtoken, getchats);
    app.get('/chatt/conversation/:id',jwtoken, getConversation);
};