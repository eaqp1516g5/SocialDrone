/**
 * Created by bernat on 26/03/16.
 */
angular.module('SocialDrone').controller('HomeCtrl', ['$scope', '$http', 'socketio', '$sce','$timeout', function ($scope, $http, socket, $sce,$timeout) {
    $scope.messages = {};
    $scope.message1 = {};
    $scope.editMessage = {};
    $scope.info = {};
    $scope.newMessage = {};
    $scope.usuar = {};
    $scope.newComment = {};
    $scope.comment = {};
    $scope.ed = {};
    $scope.date = new Date();
    var base_url_produccio = "http://147.83.7.159:8080";
    var base_url = "http://localhost:8080";
    getMessage();
    $scope.page = 0;
    $scope.editando = function (edi) {
        $scope.ed = edi;
    };
    function getMessage() {
        console.log($scope.page);
        if (sessionStorage["user"] != undefined)
            $scope.usuar = JSON.parse(sessionStorage["user"]);
        else
            $scope.usuar = {};
        $http.get(base_url + "/message") //hacemos get de todos los messages.js
            .success(function (data) {
                console.log(data);
                var spl;
                for (var i = 0; i < data.length; i++) {
                    var str = data[i].text;
                    if (str.search("youtube.com") != -1) {
                        var pl = str.split(" ");
                        for (var x = 0; x < pl.length; x++) {
                            if (pl[x].search("youtube.com") != -1) {
                                spl = pl[x].split("=")[1];
                                console.log(spl);
                                var iframe = '<br><iframe width="100%" height="315" src="https://www.youtube.com/embed/' + spl + '" frameborder="0" allowfullscreen></iframe>';
                                //data [i].text += iframe;
                                var pp = data[i].text + iframe;
                                data[i].text = $sce.trustAsHtml(pp);
                            }
                        }
                    }
                }
                $scope.messages = data;
                $http.get(base_url + '/users/' + $scope.usuar.userid, {headers: {'x-access-token': $scope.usuar.token}})
                    .success(function (data) {
                        $scope.info = data;
                        console.log($scope.info)
                    })
                    .error(function (err) {
                    });
            })
            .error(function (err) {
                console.log(err);
            });
    }

    $scope.enviarMensaje = function (id) {
        if (sessionStorage["user"] != undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            if (id == undefined) {
                if (usuario.userid != undefined) {
                    $http.post(base_url + "/message", {
                        username: usuario.userid,
                        text: $scope.newMessage.message,
                        token: usuario.token
                    })
                        .success(function (data, status, headers, config) {
                            getMessage();
                            text: $scope.newMessage.message = null;
                            console.log(data);
                        })
                        .error(function (error, status, headers, config) {
                            $timeout(function(){
                                swal("Error", error, "error");
                            })
                        });
                }
                else {
                    $http.post(base_url + "/message", {
                        username: usuario._id,
                        text: $scope.newMessage.message,
                        token: usuario.token
                    })
                        .success(function (data, status, headers, config) {
                            getMessage();
                            text: $scope.newMessage.message = null;
                            console.log(data);
                        })
                        .error(function (error, status, headers, config) {
                            $timeout(function(){
                                swal("Error", error, "error");
                            })
                        });
                }

            } else {
                $http.post(base_url + "/comment/" + id, {
                    username: $scope.info.username,
                    id: usuario.userid,
                    text: $scope.newComment.message,
                    token: usuario.token
                })
                    .success(function (data, status, headers, config) {
                        $http.get(base_url + "/message/" + id) //hacemos get de todos los users
                            .success(function (data) {
                                $scope.message1 = data;
                                $scope.comment = data.comment;
                                $scope.newComment.message = null;
                                console.log(data);
                                getMessage();
                                socket.emit('comment', $scope.message1.username._id, function (data) {
                                })
                            })

                            .error(function (err) {
                                $timeout(function(){
                                    swal("Error", err, "error");
                                })
                            });
                    })
                    .error(function (error, status, headers, config) {
                        $timeout(function(){
                            swal("Error", error, "error");
                        })
                    });
            }
        }
    }
    

    $scope.borrarComment = function (id, idc) {
        if (sessionStorage["user"] != undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            $http.delete(base_url + "/comment/" + id + "/" + idc, {headers: {'x-access-token': $scope.usuar.token}})
                .success(function (data, status, headers, config) {
                    getMessage();
                    $http.get(base_url + "/message/" + id) //hacemos get de todos los users
                        .success(function (data) {
                            $scope.message1 = data;
                            $scope.comment = data.comment;
                        })
                        .error(function (err) {
                            console.log(err);
                        });
                })
                .error(function (error, status, headers, config) {
                    $timeout(function(){
                        swal("Error", error, "error");
                    })
                });
        }
    };
    $scope.borrarMensaje = function (id) {
        if (sessionStorage["user"] != undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            swal({
                    title: "Are you sure?",
                    text: "You will not be able to recover this imaginary file!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "No, cancel plx!",
                    closeOnConfirm: false,
                    closeOnCancel: false
                },
                function (isConfirm) {
                    if (isConfirm) {

                        $http.delete(base_url + "/message/" + id, {headers: {'x-access-token': $scope.usuar.token}})
                            .success(function (data, status, headers, config) {
                                getMessage();
                                $timeout(function(){
                                    swal("Deleted!", "Your message has been deleted.", "success");
                                })
                            })
                            .error(function (error, status, headers, config) {
                                console.log(err);
                            });

                    } else {
                        $timout(function(){
                        swal("Cancelled", "Your message is safe :)", "error");
                        });
                    }
                });

        }
    };
    $scope.updateMessage = function (id) {
        $http.put(base_url + '/message/' + id, {
            text: $scope.message1.text,
            token: $scope.usuar.token
        }).success(function () {
            $http.get(base_url + "/message/" + id) //hacemos get de todos los users
                .success(function (data) {
                    $scope.message1 = data;
                    $scope.comment = data.comment;
                    $scope.editando(true);
                    getMessage();
                })
                .error(function (err) {
                });
            $scope.editMessage.text = null;
        })
            .error(function (error, status, headers, config) {
                $timeout(function(){
                    swal("Cancelled!",error, "success");
                })
            });
    };
    $scope.LikeMensaje = function (id) {
        $http.post(base_url + "/message/" + id + "/like", {token: $scope.usuar.token, userid: $scope.usuar.userid})
            .success(function (data, status, headers, config) {
                getMessage();
                $http.get(base_url + "/message/" + id) //hacemos get de todos los users
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
                $timeout(function(){
                    swal("Error!", error, "success");
                })
            });
    }
    $scope.LikeComment = function (id, idc) {
        $http.post(base_url + "/comment/" + idc + "/like", {
            token: $scope.usuar.token,
            userid: $scope.usuar.userid,
            idmes: id
        })
            .success(function (data, status, headers, config) {
                $http.get(base_url + "/message/" + id)
                    .success(function (data) {
                        $scope.comment = data.comment;
                        $scope.message1 = data;
                        getMessage();
                        socket.emit('comment', $scope.message1.username._id, function (data) {
                        })
                    })
                    .error(function (err) {
                        console.log(err);
                    });
            })
            .error(function (error, status, headers, config) {
                $timeout(function(){
                    swal("Error!", error, "success");
                })
            });
    }
    $scope.verMensaje = function (id) {
        $http.get(base_url + "/message/" + id) //hacemos get de todos los users
            .success(function (data) {
                $scope.comment = data.comment;
                $scope.message1 = data;
            })
            .error(function (err) {
                console.log(err);
            });
    };
    $scope.LikeMensajeint = function (id) {
        $http.post(base_url + "/message/" + id + "/like", {token: $scope.usuar.token, userid: $scope.usuar.userid})
            .success(function (data, status, headers, config) {
                $http.get(base_url + "/message/" + id) //hacemos get de todos los users
                    .success(function (data) {
                        $scope.message1 = data;
                        $scope.comment = data.comment;
                        getMessage();
                        socket.emit('comment', $scope.message1.username._id, function (data) {
                        })
                    })
                    .error(function (err) {
                        console.log(err);
                    });
            })
            .error(function (error, status, headers, config) {
                $timeout(function(){
                    swal("Error!", error, "success");
                })
            });
    }
}]);