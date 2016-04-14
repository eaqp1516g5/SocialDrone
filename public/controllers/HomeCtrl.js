/**
 * Created by bernat on 26/03/16.
 */
angular.module('SocialDrone').controller('HomeCtrl', function ($scope, $http) {
    $scope.messages = {};
    $scope.message1 = {};
    $scope.editMessage = {};
    $scope.newMessage = {};
    $scope.newComment = {};
    $scope.comment = {};
    var base_url_produccio = "http://147.83.7.159:8080";
    var base_url = "http://localhost:8080";
    getMessage();
    function getMessage() {
        $http.get(base_url + "/message") //hacemos get de todos los messages
            .success(function (data) {
                $scope.messages = data;
            })
            .error(function (err) {
                console.log(err);
            });
    }
    $scope.enviarMensaje = function(id) {
        if(id==undefined) {
            $http.post(base_url + "/message", {
                    username: "usuario",
                    text: $scope.newMessage.message
                })
                .success(function (data, status, headers, config) {
                    getMessage();
                })
                .error(function (error, status, headers, config) {
                    console.log(error);
                });
        }else{
            $http.post(base_url + "/comment/" + id, {
                    username: "usuario",
                    text: $scope.newComment.message
                })
                .success(function (data, status, headers, config) {
                    $http.get(base_url + "/message/" + id) //hacemos get de todos los users
                        .success(function (data) {
                            $scope.message1 = data;
                            $scope.comment = data.comment;
                            $scope.newComment.text=null;
                        })
                        .error(function (err) {
                            console.log(err);
                        });
                })
                .error(function (error, status, headers, config) {
                    console.log(error);
                });
        }
    };
    $scope.borrarComment = function (id, idc) {
        $http.delete(base_url+"/comment/" + id +"/"+ idc, {})
            .success(function (data, status, headers, config) {
                $http.get(base_url+"/message/"+id) //hacemos get de todos los users
                    .success(function(data){
                        $scope.message1= data;
                        $scope.comment = data.comment;
                    })
                    .error(function(err){
                       console.log(err);
                    });
            })
            .error(function (error, status, headers, config) {
                console.log(err);
            });
    }
    $scope.borrarMensaje = function (id) {
        $http.delete(base_url+"/message/" + id, {})
            .success(function (data, status, headers, config) {
                getMessage();
            })
            .error(function (error, status, headers, config) {
               console.log(err);
            });
    }
    $scope.updateMessage = function (id) {
        $http.put(base_url+'/message/'+id,{
            text: $scope.editMessage.text
        }).success(function () {
                $http.get(base_url+"/message/"+id) //hacemos get de todos los users
                    .success(function(data){
                        $scope.message1= data;
                        $scope.comment = data.comment;
                    })
                    .error(function(err){
                      console.log(err);
                    });
                $scope.editMessage.text=null;
            })
            .error(function (error, status, headers, config) {
                console.log(error);
            });
    };
    $scope.LikeMensaje = function (id) {
        $http.post(base_url+"/message/" + id +"/like" , {})
            .success(function (data, status, headers, config) {
                getMessage();
            })
            .error(function (error, status, headers, config) {
                console.log(error);
            });
    }
    $scope.LikeComment = function (id, idc) {
        $http.post(base_url+"/comment/" + idc + "/like" , {})
            .success(function (data, status, headers, config) {
                $http.get(base_url+"/message/" + id)
                    .success(function(data){
                        $scope.comment = data.comment;
                        $scope.message1 = data;
                    })
                    .error(function(err){
                        console.log(err);
                    });
            })
            .error(function (error, status, headers, config) {
               console.log(error);
            });
    }
    $scope.verMensaje = function(id) {
        $http.get(base_url+"/message/" + id) //hacemos get de todos los users
            .success(function(data){
                $scope.comment = data.comment;
                $scope.message1 = data;
            })
            .error(function(err){
                console.log(err);
            });
    };
    $scope.LikeMensajeint = function (id) {
        $http.post(base_url+"/message/" + id +"/like" , {})
            .success(function (data, status, headers, config) {
                $http.get(base_url+"/message/" + id) //hacemos get de todos los users
                    .success(function(data){
                        $scope.message1= data;
                        $scope.comment = data.comment;
                    })
                    .error(function(err){
                        console.log(err);
                    });
            })
            .error(function (error, status, headers, config) {
                console.log(error);
            });
    }
});