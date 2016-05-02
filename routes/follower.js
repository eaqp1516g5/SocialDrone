/**
 * Created by bernat on 2/05/16.
 */
module.exports=function (app) {
    var user = require('../models/user.js');
    var jwt    = require('jsonwebtoken');
    var jwtoken = require('../config/jwtauth.js');
    var follow = require('../models/follow.js');


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
                       followModel.following.push(id_following);
                       console.log(followModel);
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
                           console.log('**');
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

                           var j = 0;
                           console.log(data.following.length);
                           while (j < data.following.length) {
                           
                               if (data.following[j] = id_following) {
                                   console.log('Ya lo sigues');
                                   res.send('Ya lo sigues').status(409);
                                   break;
                                   
                               }
                               else {
                                   console.log('No encuentro');
                                   j = j + 1;
                               }
                               
                                console.log('No lo sigues aun');
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
                                }//res.send('Ahora ya lo sigues').status(200);
                                });

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
    //Endpoints ************************

    app.post('/follow/:userid', followUser);
};