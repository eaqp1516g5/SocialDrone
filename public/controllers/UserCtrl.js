/**
 * Created by bernat on 8/05/16.
 */
angular.module('SocialDrone').controller('UserCtrl',['$http', '$scope', '$window','$rootScope', function ($http, $scope, $window, $rootScope) {
    var base_url = "http://localhost:8080";
    $scope.userSearch={};
    $scope.numFollowing={};
    $scope.numFollowers={};
    $scope.follow=false;
    $scope.follower=false;
    $scope.noFollow=true;
    $scope.noFollower=true;
    $scope.logged=false;
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
    function getUser() {

        var user = sessionStorage["userSearch"];
        $http.get(base_url+'/api/user/'+user).success(function (data) {
            $scope.userSearch=data;
            getFollowing(data._id);
            getFollowers(data._id);
            var us=data._id;
            if(sessionStorage["user"]!=undefined){
                var miUsuario = JSON.parse(sessionStorage["user"]);
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
    var miUsuario = JSON.parse(sessionStorage["user"]);
$scope.letfollow= function () {

    $http.get(base_url+'/users/'+miUsuario.userid, {headers: {'x-access-token': miUsuario.token}}).success(function (data) {
        $http.post(base_url+'/follow/'+miUsuario.userid, {
        follow:user
        }).success(function (data) {
            getUser();
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