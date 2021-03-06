/**
 * Created by bernat on 2/05/16.
 */
module.exports=function (app) {
    var user = require('../models/user.js');
    var jwt    = require('jsonwebtoken');
    var jwtoken = require('../config/jwtauth.js');
    var follow = require('../models/follow.js');
    var notification = require('../models/notification.js');


    followUser=function (req, res) {
        var i = 0;
        var user_id = req.params.userid; //Esto es el _id de mi usuario!
        var following = req.body.follow; //Esto es el username del usuario que quiero seguir
        user.findOne({username:following}, function (error,data) { //Busco el usuario al que quiero seguir
           if(data!=null){
               var id_following = data._id;
               follow.findOne({userid: user_id}, function (error, data) {
                   
                   if(data==null){
                       var followModel = new follow ({
                           userid:user_id,
                           following:{},
                           follower:{}
                       });
                       notification.findOne({userid: id_following, type: 1, actionuserid: user_id}).exec(function(err,res){
                           if(err) console.log("Falla");
                           else if(res==undefined) {
                               var notify = new notification({
                                   userid: id_following,
                                   type: 1,
                                   actionuserid: user_id,
                                   text: "is following you",
                                   idnotification: user_id
                               })
                               notify.save(function (err) {
                                   if (err)res.status(500).send('Internal server error');
                               })
                           }
                       })
                       followModel.following.push(id_following);
                       followModel.save(function (err, data) {
                           if (err){
                               res.send('Error').status(400);
                               console.log(err);}
                           else{
                               follow.findOne({userid: id_following}, function (error, data) {
                                   if(data==null){
                                       var followerModel = new follow ({
                                           userid:id_following,
                                           following:{},
                                           follower:{}
                                       });
                                       followerModel.follower.push(user_id);
                                       followerModel.save(function (err, data) {
                                           if(err)
                                               res.send().status(400);
                                           res.send('Todo OK').status(200);
                                       })
                                   }
                                   else{
                                       data.follower.push(user_id);
                                       data.save(function (err, data) {
                                           if(err)
                                               res.send().status(400);
                                           res.send('Todo OK').status(200);
                                       })
                                   }
                               })
                           }
                       })
                   }
                   else{
                       console.log(data.following.length);
                       if(data.following.length==0){
                           notification.findOne({userid: id_following, type: 1, actionuserid: user_id}).exec(function(err,res){
                               if(err) console.log("Falla");
                               else if(res==undefined) {
                                   var notify = new notification({
                                       userid: id_following,
                                       type: 1,
                                       actionuserid: user_id,
                                       text: "is following you",
                                       idnotification: user_id
                                   })
                                   notify.save(function (err) {
                                       if (err)res.status(500).send('Internal server error');
                                   })
                               }
                           })
                           data.following.push(id_following);
                           data.save(function (err, data) {
                               if(err)
                                   res.send().status(400);
                               else {
                                   follow.findOne({userid: id_following}, function (error, data) {
                                       console.log('Busco el otro usuario');
                                       console.log(data);
                                       if(data==null){
                                           var followerM = new follow ({
                                               userid:id_following,
                                               following:{},
                                               follower:{}
                                           });
                                           followerM.follower.push(user_id);
                                           followerM.save(function (err, data) {
                                               if(err)
                                                   res.send().status(400);
                                               res.send('Todo OK').status(200);
                                           })
                                       }
                                       else{
                                           data.follower.push(user_id);
                                           data.save(function (err, data) {
                                               if(err)
                                                   res.send().status(400);
                                               res.send('Todo OK').status(200);
                                           })
                                       }
                                   })
                               }
                           })
                       }
                        else if (data.following.length!=0) {
                           var siguiendo = 0;
                           var j = 0;
                           console.log(data.following.length);
                           while (j < data.following.length) {

                               if (data.following[j] == id_following) {
                                   siguiendo = 1;
                                   //res.send('Ya lo sigues').status(409);
                                   break;
                               }
                               else {
                                   j = j + 1;
                               }
                           }
                           console.log(siguiendo+'***************************');
                           if (siguiendo==0){
                                console.log('No lo sigues aun');
                                data.following.push(id_following);
                               notification.findOne({userid: id_following, type: 1, actionuserid: user_id}).exec(function(err,res){
                                   if(err) console.log("Falla");
                                   else if(res==undefined) {
                                       var notify = new notification({
                                           userid: id_following,
                                           type: 1,
                                           actionuserid: user_id,
                                           text: "is following you",
                                           idnotification: user_id
                                       })
                                       notify.save(function (err) {
                                           if (err)res.status(500).send('Internal server error');
                                       })
                                   }
                               })
                                data.save(function (err, data) {
                                    if (err)
                                        res.send().status(400);
                                    else {
                                        follow.findOne({userid: id_following}, function (error, data) {
                                            console.log('Busco el otro usuario');
                                            console.log(data);
                                            if (data == null) {
                                                var followerM = new follow({
                                                    userid: id_following,
                                                    following: {},
                                                    follower: {}
                                                });
                                                followerM.follower.push(user_id);
                                                followerM.save(function (err, data) {
                                                    if (err)
                                                        res.send().status(400);
                                                    res.send('Todo OK').status(200);
                                                })
                                            }
                                            else {
                                                data.follower.push(user_id);
                                                data.save(function (err, data) {
                                                    if (err)
                                                        res.send().status(400);
                                                    res.send('Todo OK').status(200);
                                                })
                                            }
                                        })
                                    }
                                })
                                }
                           else if (siguiendo==1){
                               res.send('Ya lo sigues').status(400);
                           }
                               
                       }
                       
                   }
               })
           }
            else {
               res.send('Not found').status(404);
           }
        })
        
    };
    followingUser=function (req, res) {
        var find = false;
        var user_id = req.params.userid; //Esto es el _id de mi usuario!
        var following = req.params.following; //Esto es el _id del usuario que quiero saber si estoy siguiendo
        user.findOne({_id:user_id}, function (error,data) {
            console.log(data);
            if(data!=null) {
                follow.findOne({userid: user_id}, function (error, data) {
                    if(data!=null) {
                        console.log(data.following);
                        var j = 0;
                        while (j < data.following.length) {
                            if (data.following[j] == following) {
                                find=true;
                                console.log('fiiiiiinnnnndddd= '+find);
                                break;
                               //res.send('Siguiendo').status(200);
                                //break;
                            }
                            else {
                                j = j + 1;
                            }

                        }
                        if(find)
                            res.send('Siguiendo').status(200);
                        else
                            res.send('No sigues').status(200);


                    }
                    else
                        res.send('Not following').status(404)
                });
            }
            else
                res.send('User not found').status(404);
        });
    };
    unfollow=function (req, res) {
        console.log(req.body.unfollow);
        var user_id = req.params.userid; //Esto es el _id de mi usuario!
        var following = req.body.unfollow; //Esto es el username del usuario que quiero dejar de seguir
        user.findOne({username:following}, function (error, data) { //Busco el usuario a dejar de seguir
            var user_id_unfollow = data._id;
            if (data == null) {
                res.send('Not found').status(404);
            }
            else {
                follow.findOne({userid: user_id_unfollow}, function (error, data) {
                    if (data == null) {
                        res.send('Not found follow table').status(404);
                    }
                    else {
                        console.log('Voy a dejarte de seguir');
                        var find = 0;
                        var j = 0;
                        while (j < data.follower.length) {
                            if (data.follower[j] == user_id) {
                                console.log('Lo encuentro');
                                var user_follow=data.follower[j];
                                console.log('******************'+user_follow);
                                data.follower.pull(user_id);
                                data.save(function (err, data) {
                                    if (err)
                                        console.log(err);
                                    else {
                                        follow.findOne({userid: user_id}, function (err, data) {
                                            console.log(data);
                                            if (data != null) {
                                                data.following.pull(user_id_unfollow);
                                                data.save(function (err) {
                                                    if (err)
                                                        console.log(err);
                                                    //res.send('OK').status(200)
                                                })
                                            }

                                        })
                                    }
                                });
                                find=1;
                                console.log('*****************');
                                //res.send('OK').status(200);
                                break;
                            }
                            else{
                                j++;
                            }
                        }
                        console.log(find);
                        if(find==0){
                            res.send('Not found').status(404);
                        }
                        else {
                            console.log('oddddddddddddddd');
                            res.send('OK').status(200);
                        }
                    }
                });
            }
        });
    };
    
    getFollowers=function (req,res) {
            var user_id = req.params.userid;
            follow.findOne({userid:user_id}).populate('follower').exec(function (err, data) {
                res.status(200).json(data.follower);
            })
    };
    
    getFollowing=function (req,res) {
        var user_id = req.params.userid;
        follow.findOne({userid:user_id}).populate('following').exec(function (err, data) {
            res.status(200).json(data.following);
        })
    };
  
    //Endpoints ************************
    app.post('/follow/:userid', followUser);
    app.get('/following/:userid/:following', followingUser);
    app.delete('/unfollow/:userid', unfollow);
    app.get('/following/:userid', getFollowing);
    app.get('/followers/:userid', getFollowers);
};