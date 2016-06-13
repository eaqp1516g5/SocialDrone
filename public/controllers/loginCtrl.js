/**
 * Created by bernat on 18/04/16.
 */

angular.module('SocialDrone').controller('LoginCtrl', ['$http', '$scope', '$window', '$rootScope', 'socketio','$timeout', function ($http, $scope, $window, $rootScope, socket, $timeout) {
    $scope.newUser = {};
    $scope.usuar = {};
    $scope.users = {};
    $scope.cosi = {};
    $scope.edit = 0;
    $scope.chat = {};
    $scope.novisto = 0;
    $scope.notlength = 0;
    $scope.loginUser = {};
    $scope.registrar = {};
    $scope.currentUser = {};
    $scope.markers = [];
    $scope.currentUserSocial = {};
    $scope.inputType = 'password';
    $scope.follow = false;
    $scope.follower = false;
    $scope.userFB=false;
    $scope.notification = [];
    var base_url = "http://localhost:8080";

    if ($scope.currentUser) {
        socket.on('connection', function (data) {
            socket.emit('username', $scope.currentUser.username, function (data) {
            });
            socket.emit('notification', $scope.currentUser._id, function (data) {
            });
            socket.emit('chatnotification', $scope.currentUser._id, function (data) {
            })
        })
        socket.on('chatnotification', function (data) {
            $scope.chat = data.data;
            $scope.novisto = data.visto;
        });
        socket.on('listaNicks', function (data) {
            console.log(data);
        })
        socket.on('new notification', function (data) {
            socket.emit('notification', $scope.currentUser._id, function (data) {
            })
        })
        socket.on('newchatnotification', function (data) {
            console.log('adios');
            setTimeout(function () {
                console.log('hola');
                socket.emit('chatnotification', $scope.currentUser._id, function (data) {
                })
            }, 1000);
        })
        socket.on('notification', function (data) {
            $scope.notlength = data.numeros;
            $scope.notification = data.notifications;
        })
    }
    function volver() {
        window.location = base_url;
    };
    $scope.file_changed = function (element) {
        $scope.$apply(function (scope) {
            var photofile = element.files[0];
            console.log(photofile);
            var reader = new FileReader();
            reader.onload = function (e) {
                foto = e.target.result;
            };
            reader.readAsDataURL(photofile);
        });
    };
    $scope.deleteDrone = function(id){
        if(sessionStorage["user"]!=undefined){
            var usuario=JSON.parse(sessionStorage["user"]);
        }
        $http.delete(base_url+"/user/addDr/"+id , {headers: {'x-access-token':usuario.token, userid: usuario.userid}}

            )
            .success(function (data, status, headers, config) {
                getUser();
                $timeout(function(){
                    swal("Succeed", data, "success");
                })            })
            .error(function (error, status, headers, config) {
                $timeout(function(){
                    swal("Error", error, "error");
                })
            });
    }
    $scope.gotoDrone = function(dr){
        sessionStorage["dronsi"]= JSON.stringify(dr);
        window.location.href= "/droneprofile";
    };
    $scope.deregister = function (id) {
        console.log("la voy a liar parda" + id);
        swal({
            title: "Are your sure to deregister?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, I am sure"
        }, function () {
            $http.delete(base_url + '/borraruser/' + id).success(function (data) {
                console.log(data);
                if (data == "ok")
                    location.href = "/";
            }).error(function (err) {
                $timeout(function(){
                    swal("Error", err, "error");
                })
            })
        })

    }
    $scope.ir = function (id) {
        sessionStorage['conver'] = JSON.stringify({_id: id});
        window.location.replace(base_url + '/chat');
    }
    $scope.loginFacebook = function (err) {
        //window.location='http://localhost:8080/auth/facebook';
        if (err)
            console.log('Error');
        else {
            $http.get(base_url + '/profile')
                .success(function (data) {
                    sessionStorage["userSocial"] = JSON.stringify(data);
                    console.log(data);
                })
                .error(function (err) {
                    $timeout(function(){
                        swal("Error", err, "error");
                    })
                });
        }
    };
    getUser();
    $scope.drones={};
    function getUser() {
        $scope.cosi = 0;
        if (sessionStorage["user"] != undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            console.log(usuario);
            $http.get(base_url + '/users/' + usuario.userid, {headers: {'x-access-token': usuario.token}})
                .success(function (data) {
                    if(usuario.idFB!=undefined){
                        $scope.userFB=true;
                    }
                    console.log($scope.userFB);
                    $scope.currentUser = data;
                    $scope.drones=data.mydrones;
                    $rootScope.usr = data;
                    sessionStorage["userInfo"] = data;
                    getFollowing(data._id);
                    getFollowers(data._id);
                })
                .error(function (err) {
                    $http.get(base_url + '/usersS/' + usuario.idFB, {headers: {'x-access-token': usuario.token}})
                        .success(function (data) {
                            $scope.currentUser = data;

                            sessionStorage["userInfo"] = data;
                            console.log($scope.currentUser);
                        })
                        .error(function (err) {
                            console.log('ERROR');
                        });
                });
        }
    }

    $scope.ira = function (type, id, nombre) {
        if (sessionStorage["user"] != undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            if (type == 1) {
                $http.get(base_url + '/api/user/' + nombre, {headers: {'x-access-token': usuario.token}}).success(function (data) {
                    socket.emit('vistonotification', {userid: usuario.userid, id: id});
                    sessionStorage["userSearch"] = data.username;
                    window.location.href = "/user";
                }).error(function (err) {
                    $timeout(function(){
                        swal("Error", err, "error");
                    })
                });
            }
            else if (type == 0 || type == 2 || type == 3) {
                $http.get(base_url + "/message/" + id) //hacemos get de todos los users
                    .success(function (data) {
                        socket.emit('vistonotification', {userid: usuario.userid, id: id});
                        sessionStorage["messagenot"] = JSON.stringify(data);
                        window.location.href = "/messages";
                    })
                    .error(function (err) {
                        $timeout(function(){
                            swal("Error", err, "error");
                        })
                    });
            }
            else if (type == 4) {
                $http.get(base_url + '/event/' + id)
                    .success(function (data) {
                        socket.emit('vistonotification', {userid: usuario.userid, id: id});

                        sessionStorage["eventoid"] = JSON.stringify(data);
                        window.location.href = "/even";
                    })
                    .error(function (err) {
                        $timeout(function(){
                            swal("Error", err, "error");
                        })
                    });
            }
        }
    }
    $http.get(base_url + '/users').success(function (data) {
        $scope.users = data;
        console.log("Obtengo users");
        console.log($scope.users);
    });
    var _selected;
    $scope.selected = undefined;
    $scope.onSelect = function ($item, $model, $label) {
        sessionStorage["userSearch"] = $model.username;
        window.location.href = "/user";
        console.log($model.username);
        $scope.$item = $item;
        $scope.$model = $model;
        $scope.$label = $label;
        $scope.userSelected = $model.username;

    };
    $scope.modelOptions = {
        debounce: {
            default: 500,
            blur: 250
        },
        getterSetter: true
    };
    $scope.registrarUser = function () {
        var UsarioLocalNuevo = new FormData();
        UsarioLocalNuevo.append('username', $scope.newUser.username);
        UsarioLocalNuevo.append('password', $scope.newUser.password);
        UsarioLocalNuevo.append('name', $scope.newUser.name);
        UsarioLocalNuevo.append('lastname', $scope.newUser.lastname);
        UsarioLocalNuevo.append('mail', $scope.newUser.mail);
        UsarioLocalNuevo.append('imageUrl', $('#imgInp')[0].files[0]);
        console.log(UsarioLocalNuevo);
        if ($scope.newUser.username != undefined && $scope.newUser.password != undefined && $scope.newUser.name != undefined && $scope.newUser.lastname != undefined && $scope.newUser.mail != undefined) {
            $http.post(base_url + '/users', UsarioLocalNuevo, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
                /* username: $scope.newUser.username,
                 password: $scope.newUser.password,
                 name: $scope.newUser.name,
                 lastname: $scope.newUser.lastname,
                 mail: $scope.newUser.mail*/
            }).success(function (data) {
                $scope.newUser.username = null;
                $scope.newUser.password = null;
                $scope.newUser.name = null;
                $scope.newUser.lastname = null;
                $scope.newUser.mail = null;
                $scope.Regist(true);
            })
                .error(function (error, status, headers, config) {
                    console.log(error);
                    $timeout(function(){
                        swal("Error", error, "error");
                    })
                    $scope.newUser.username = null;
                });
        }
    };
    $scope.loginUser = function () {
        if ($scope.loginUser.username != undefined && $scope.loginUser.password != undefined) {
            $http.post(base_url + '/authenticate', {
                username: $scope.loginUser.username,
                password: $scope.loginUser.password
            }).success(function (data) {
                if (data.success == false) {
                    $scope.loginUser.username = null;
                    $scope.loginUser.password = null;
                    $timeout(function(){
                        swal("Error", data.message, "error");
                    })
                }
                else {
                    $scope.loginUser.username = null;
                    $scope.loginUser.password = null;
                    sessionStorage["user"] = JSON.stringify(data);
                    volver();
                }
            }).error(function (error, status, headers, config) {
                $timeout(function(){
                    swal("Error", error, "error");
                })
            });
        }
    };
    $scope.Regist = function (re) {
        $scope.registrar = re;
    };
    $scope.setEdit = function () {
        $scope.edit = 1;
    };
    $scope.logout = function (userid) {
        if (sessionStorage["user"] != undefined) {
            $scope.usuar = JSON.parse(sessionStorage["user"]);
            $http.delete(base_url + '/authenticate/' + $scope.usuar._id, {
                headers: {'x-access-token': $scope.usuar.token}

            }).success(function () {
                socket.emit('disconnect', $scope.usuar.username);
                socket.disconnect();
                sessionStorage.removeItem("user");
                $scope.usuar = null;
                window.location = base_url;
            }).error(function (err) {
                $timeout(function(){
                    swal("Error", err, "error");
                })
            })
        }
    };
    $scope.numFollowing = {};
    $scope.numFollowers = {};
    $scope.followings = {};
    $scope.followers = {};

    $scope.unfollow = function (username) {
        var user_id = $scope.currentUser._id;
        $http({
            method: 'DELETE',
            url: base_url + '/unfollow/' + user_id,
            data: {unfollow: username},
            headers: {'Content-Type': 'application/json'}

        }).success(function (data) {
            console.log('OK');
            getFollowing(user_id);
        }).error(function (err) {
            $timeout(function(){
                swal("Error", err, "error");
            })
        })
    };
    function getFollowing(userid) {
        $http.get(base_url + '/following/' + userid).success(function (data) {
            $scope.numFollowing = data.length;
            $scope.followings = data;
            if (data.length != 0)
                $scope.follow = true;
        }).error(function (err) {
            console.log(err)
        })
    }

    function getFollowers(userid) {
        $http.get(base_url + '/followers/' + userid).success(function (data) {
            console.log(data);
            $scope.numFollowers = data.length;
            $scope.followers = data;
            if (data.length != 0)
                $scope.follower = true;
        }).error(function (err) {
            console.log(err)
        })
    }

    $scope.updateUser = function () {

        if ($scope.currentUser.name == undefined || $scope.currentUser.lastname == undefined) {
            $timeout(function(){
                swal({title: "Error!", text: 'Field must be filled in', type: "error", confirmButtonText: "Accept"});
            })
        }
        else if ($scope.currentUser.mail == undefined) {
            $timeout(function(){
                swal({title: "Error!", text: 'This mail is not valid', type: "error", confirmButtonText: "Accept"});
            })
        }
        else if ($scope.currentUser.password == undefined) {
            $timeout(function(){
                swal({title: "Error!", text: 'Password is a field required', type: "error", confirmButtonText: "Accept"});
            })
        }
        /*   else if ($scope.currentUser.password != $scope.currentUser.password2 ) {
         swal({title: "Error!", text: 'Retype password', type: "error", confirmButtonText: "Accept"});
         }
         */
        else {

            $http.put(base_url + '/users/' + $scope.currentUser.username, {
                username: $scope.currentUser.username,
                password: $scope.currentUser.password,
                name: $scope.currentUser.name,
                lastname: $scope.currentUser.lastname,
                mail: $scope.currentUser.mail
            }).success(function () {
                $scope.cosi = 0;
                $scope.edit = 0;
            }).error(function (error, status, headers, config) {
                $timeout(function(){
                    swal({title: "Error!", text: error, type: "error", confirmButtonText: "Accept"});
                })
            });
        }
    };
    $scope.checkpassword = function () {

        if ($scope.currentUser.password == undefined || $scope.currentUser.password1 != $scope.currentUser.password2 || $scope.currentUser.password1 == undefined) {
            $timeout(function() {
                swal({title: "Error!", text: 'Password invalid', type: "error", confirmButtonText: "Accept"});
            })
        }

        else {
            $http.put(base_url + '/users/password/' + $scope.currentUser.username, {
                password: $scope.currentUser.pass,
                password1: $scope.currentUser.password1
            }).success(function () {
                console.log('All right');
                $scope.cosi = 0;
                $scope.edit = 0;
            }).error(function (error, status, headers, config) {
                $timeout(function() {
                    swal({title: "Error!", text: error, type: "error", confirmButtonText: "Accept"});
                })
            });
        }
    }
    $scope.hideShowPassword = function () {
        if ($scope.inputType == 'password')
            $scope.inputType = 'text';
        else
            $scope.inputType = 'password';
    };


}]);
