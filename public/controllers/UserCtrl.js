/**
 * Created by bernat on 8/05/16.
 */
angular.module('SocialDrone').controller('UserCtrl',['$http', '$scope', '$window','$rootScope','socketio','$timeout', function ($http, $scope, $window, $rootScope,socket, $timeout) {
    var base_url = "http://localhost:8080";
    $scope.myuser = {};
    $scope.userSearch={};
    $scope.numFollowing={};
    $scope.drones={};
    $scope.numFollowers={};
    $scope.follow=false;
    $scope.follower=false;
    $scope.noFollow=true;
    $scope.noFollower=true;
    $scope.logged=false;
    $scope.fbuser=false;
    function getFollowing(userid) {
        $http.get(base_url+'/following/'+userid).success(function (data) {
            $scope.numFollowing=data.length;
            $scope.followings=data;
            if(data.length!=0) {
                $scope.noFollow=false;
                $scope.follow = true;
            }
        }).error(function (err) {
            console.log(err)
        })
    }
    function getFollowers(userid) {
        $http.get(base_url+'/followers/'+userid).success(function (data) {
            $scope.numFollowers=data.length;
            $scope.followers=data;
            if(data.length!=0){
                $scope.noFollower=false;
                $scope.follower=true;}
            console.log('ooi'+$scope.noFollower);
        }).error(function (err) {
            console.log(err)
        })
    }
    function isFollowing(miId, userid){
        $http.get(base_url+'/following/'+miId+'/'+userid).success(function (data) {
            if(data=="No sigues")
                $scope.nolosigues=true;
            else
                $scope.nolosigues=false;

            console.log($scope.nolosigues+'No lo sigues?');

        }).error(function (err) {
            console.log(err)
        });

    }
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
    $scope.havedrone=false;
    function getUser() {

        var user = sessionStorage["userSearch"];
        $http.get(base_url+'/api/user/'+user).success(function (data) {
            $scope.userSearch=data;
            if(data.id_facebook!=undefined)
            $scope.fbuser=true;
            console.log(data.id_facebook);
            $scope.drones=data.mydrones;
            if(data.mydrones.length!=0) {
                $scope.havedrone = true;
            }
            getFollowing(data._id);
            getFollowers(data._id);
            var us=data._id;
            if(sessionStorage["user"]!=undefined){
                var miUsuario = JSON.parse(sessionStorage["user"]);
                $scope.currentUser = JSON.parse(sessionStorage["user"]);
                $http.get(base_url+'/users/'+miUsuario.userid, {headers: {'x-access-token': miUsuario.token}}).success(function (data) {
                    if(data.username!=user){
                        isFollowing(miUsuario.userid, us);
                    }
                }).error(function (err) {
                    console.log(err);
                });
            }
        }).error(function (err) {
            console.log(err)
        });
    }

    var user = sessionStorage["userSearch"];
    if(sessionStorage["user"]!=undefined||sessionStorage["user"]!=null) {
        var miUsuario = JSON.parse(sessionStorage["user"]);
        $scope.myuser = JSON.parse(sessionStorage["user"]);
    }
    $scope.initChat = function (id) {
        $http.post(base_url+'/chatt', {
            token: $scope.myuser.token,
            user: $scope.userSearch._id,
            userid: $scope.myuser.userid
        }).success(function (data) {
            sessionStorage['conver']=JSON.stringify(data);
            window.location.replace(base_url+'/chat');
        }).error(function (err) {
            console.log(err)
        });
    };
$scope.letfollow= function () {

    $http.get(base_url+'/users/'+miUsuario.userid, {headers: {'x-access-token': miUsuario.token}}).success(function (data) {
        $http.post(base_url+'/follow/'+miUsuario.userid, {
        follow:user
        }).success(function (data) {
            getUser();
            socket.emit('follow',user, function(data){
            } )
        }).error(function (err) {
            console.log(err)
        });
    }).error(function (err) {
        console.log(err)
    });
    };
    $scope.letunfollow= function () {

        $http.get(base_url+'/users/'+miUsuario.userid, {headers: {'x-access-token': miUsuario.token}}).success(function (data) {
            $http({
                method: 'DELETE',
                url: base_url + '/unfollow/' + miUsuario.userid,
                data: {unfollow: user},
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                console.log(data);
            getUser()
            }).error(function (err) {
                console.log(err);
            })
        }).error(function (err) {
            console.log(err);
        })
    };

    getUser();
}]);