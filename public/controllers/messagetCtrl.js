/**
 * Created by Admin on 15/05/2016.
 */
angular.module('SocialDrone').controller('messagetCtrl',['$scope','$http','socketio','$timeout', function ($scope, $http,socket,$timeout) {
    $scope.message = {};
    $scope.comment = {};
    $scope.usuar = {};
    $scope.err=false;
    var base_url = "http://localhost:8080";
    $scope.likes=function(id, likes){
        var li = false;
        for(var i = 0; i<likes.length; i++){
            if(likes[i]==id){
                li=true;
            }
        }
        return li;
    }
    $scope.dislikeMessage=function(id){
        $http.delete(base_url + "/message/" + id + "/dislike",  {headers: {'x-access-token': $scope.usuar.token, userid:  $scope.usuar.userid}})
            .success(function (data, status, headers, config) {
                $http.get(base_url+"/message/"+id) //hacemos get de todos los users
                    .success(function(data){
                        $scope.message= data;
                        $scope.comment = data.comment;
                        sessionStorage["messagenot"]=JSON.stringify(data);;
                    })
                    .error(function(err){
                        console.log(err);
                    });
            })
            .error(function (error, status, headers, config) {
                $timeout(function () {
                    swal("Error!", error, "error");
                })
            });
    }
    $scope.dislikeComment=function(id, idc){
        $http.delete(base_url + "/comment/" + id + "/dislike",  {headers: {'x-access-token': $scope.usuar.token, userid:  $scope.usuar.userid}})
            .success(function (data, status, headers, config) {
                $http.get(base_url+"/message/"+idc) //hacemos get de todos los users
                    .success(function(data){
                        $scope.message= data;
                        $scope.comment = data.comment;
                        sessionStorage["messagenot"]=JSON.stringify(data);
                    })
                    .error(function(err){
                        console.log(err);
                    });
            })
            .error(function (error, status, headers, config) {
                $timeout(function () {
                    swal("Error!", error, "error");
                })
            });
    }
    $scope.dislikeComment=function(id, idc){
        $http.delete(base_url + "/commentt/" + id + "/dislike",  {headers: {'x-access-token': $scope.usuar.token, userid:  $scope.usuar.userid}})
            .success(function (data, status, headers, config) {
                $http.get(base_url + "/message/" + idc) //hacemos get de todos los users
                    .success(function (data) {
                        $scope.comment = data.comment;
                        $scope.message1 = data;
                        socket.emit('comment', $scope.message1.username._id, function (data) {
                        })
                    })
                    .error(function (err) {
                    });

            })
            .error(function (error, status, headers, config) {
                $timeout(function () {
                    swal("Error!", error, "error");
                })
            });
    }
    getmessage = function() {
        if (sessionStorage["user"] != undefined) {
            $scope.usuar = JSON.parse(sessionStorage["user"]);
            if (sessionStorage["messagenot"] != 'null' && sessionStorage["messagenot"] != undefined && sessionStorage["messagenot"] != '[object Object]') {
                var message = JSON.parse(sessionStorage["messagenot"]);
                $scope.message = message;
                $scope.comment = message.comment;
                $http.get(base_url+"/message/"+message._id) //hacemos get de todos los users
                    .success(function(data){
                        $scope.message= data;
                        $scope.comment = data.comment;
                    })
                    .error(function(err){
                        console.log(err);
                    });
            }
            else{
                sessionStorage["messagenot"] = 'null';
                $scope.err=true;
            }
        }
    }
    getmessage();
    $scope.borrarComment = function (id, idc) {
            $http.delete(base_url+"/comment/" + id +"/"+ idc, {headers: {'x-access-token': $scope.usuar.token}})
                .success(function (data, status, headers, config) {
                    $http.get(base_url+"/message/"+id) //hacemos get de todos los users
                        .success(function(data){
                            $scope.message= data;
                            $scope.comment = data.comment;
                            sessionStorage["messagenot"]=JSON.stringify(data);;
                        })
                        .error(function(err){
                            console.log(err);
                        });
                })
                .error(function (error, status, headers, config) {
                    $timeout(function(){
                        swal("Error!", error, "success");
                    })
                });
    };
    $scope.LikeMensaje = function (id) {
        $http.post(base_url+"/message/" + id +"/like" , {token: $scope.usuar.token, userid:  $scope.usuar.userid})
            .success(function (data, status, headers, config) {
                $http.get(base_url+"/message/"+id) //hacemos get de todos los users
                    .success(function(data){
                        $scope.message= data;
                        $scope.comment = data.comment;
                        sessionStorage["messagenot"]=JSON.stringify(data);;
                    })
                    .error(function(err){
                        console.log(err);
                    });
                socket.emit('comment',data.username, function(data){
                } )
            })
            .error(function (error, status, headers, config) {
                $timeout(function(){
                    swal("Error!", error, "success");
                })
            });
    }
    $scope.LikeComment = function (id, idc) {
        $http.post(base_url+"/comment/" + idc + "/like" , {token: $scope.usuar.token,  userid:  $scope.usuar.userid, idmes: id})
            .success(function (data, status, headers, config) {
                $http.get(base_url+"/message/" + id)
                    .success(function(data){
                        $scope.comment = data.comment;
                        $scope.message = data;
                        sessionStorage["messagenot"]=JSON.stringify(data);;
                        socket.emit('comment',$scope.message.username._id, function(data){
                        } )
                    })
                    .error(function(err){
                        console.log(err);
                    });
            })
            .error(function (error, status, headers, config) {
                $timeout(function(){
                    swal("Error!", error, "success");
                })
            });
    }
    $scope.borrarMensaje = function (id) {
        if(sessionStorage["user"]!=undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            swal({   title: "Are you sure?",   text: "You will not be able to recover message!",
                    type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "No, cancel plx!",   closeOnConfirm: false,   closeOnCancel: false },
                function(isConfirm){
                    if (isConfirm) {

                        $http.delete(base_url + "/message/" + id, {headers: {'x-access-token': $scope.usuar.token}})
                            .success(function (data, status, headers, config) {
                                $timeout(function(){
                                    swal("Deleted!", "Your message has been deleted.", "success");
                                });
                                window.location.href=base_url;
                            })
                            .error(function (error, status, headers, config) {
                                $timeout(function(){
                                    swal("Error!", error, "success");
                                })
                            });

                    } else {
                        $timeout(function(){
                            swal("Cancelled", "Your message is safe :)", "error");
                        })
                    }
                });

        }
    };
}]);