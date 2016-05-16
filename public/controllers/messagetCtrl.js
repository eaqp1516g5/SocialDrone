/**
 * Created by Admin on 15/05/2016.
 */
angular.module('SocialDrone').controller('messagetCtrl', function ($scope, $http) {
    $scope.message = {};
    $scope.comment = {};
    $scope.usuar = {};
    var base_url = "http://localhost:8080";
    var socket_url = "http://localhost:3000";
    var socket = io(socket_url);
    getmessage = function() {
        if (sessionStorage["user"] != undefined) {
            $scope.usuar = JSON.parse(sessionStorage["user"]);
            if (sessionStorage["messagenot"] != undefined) {
                var message = JSON.parse(sessionStorage["messagenot"]);
                $scope.message = message;
                $scope.comment = message.comment;
                $http.get(base_url+"/message/"+message._id) //hacemos get de todos los users
                    .success(function(data){
                        sessionStorage["messagenot"]=data;
                        $scope.message= data;
                        $scope.comment = data.comment;
                    })
                    .error(function(err){
                        console.log(err);
                    });
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
                            sessionStorage["messagenot"]=data;
                        })
                        .error(function(err){
                            console.log(err);
                        });
                })
                .error(function (error, status, headers, config) {
                    console.log(err);
                });
    };
    $scope.LikeMensaje = function (id) {
        $http.post(base_url+"/message/" + id +"/like" , {token: $scope.usuar.token, userid:  $scope.usuar.userid})
            .success(function (data, status, headers, config) {
                $http.get(base_url+"/message/"+id) //hacemos get de todos los users
                    .success(function(data){
                        $scope.message= data;
                        $scope.comment = data.comment;
                        sessionStorage["messagenot"]=data;
                    })
                    .error(function(err){
                        console.log(err);
                    });
                socket.emit('comment',data.username, function(data){
                } )
            })
            .error(function (error, status, headers, config) {
                console.log(error);
            });
    }
    $scope.LikeComment = function (id, idc) {
        $http.post(base_url+"/comment/" + idc + "/like" , {token: $scope.usuar.token,  userid:  $scope.usuar.userid})
            .success(function (data, status, headers, config) {
                $http.get(base_url+"/message/" + id)
                    .success(function(data){
                        $scope.comment = data.comment;
                        $scope.message = data;
                        sessionStorage["messagenot"]=data;
                        socket.emit('comment',$scope.message.username._id, function(data){
                        } )
                    })
                    .error(function(err){
                        console.log(err);
                    });
            })
            .error(function (error, status, headers, config) {
                console.log(error);
            });
    }
    $scope.borrarMensaje = function (id) {
        if(sessionStorage["user"]!=undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            swal({   title: "Are you sure?",   text: "You will not be able to recover this imaginary file!",
                    type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "No, cancel plx!",   closeOnConfirm: false,   closeOnCancel: false },
                function(isConfirm){
                    if (isConfirm) {

                        $http.delete(base_url + "/message/" + id, {headers: {'x-access-token': $scope.usuar.token}})
                            .success(function (data, status, headers, config) {
                                swal("Deleted!", "Your imaginary file has been deleted.", "success");
                                window.location.href=base_url;
                            })
                            .error(function (error, status, headers, config) {
                                console.log(err);
                            });

                    } else {
                        swal("Cancelled", "Your imaginary file is safe :)", "error");
                    }
                });

        }
    };
});