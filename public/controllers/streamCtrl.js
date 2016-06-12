/**
 * Created by kenshin on 28/03/16.
 */
angular.module('SocialDrone').controller('streamCtrl', function ($scope, $http,$alert, $timeout) {
    var base_url = "http://localhost:8080";
    var base_url_produccio = "http://147.83.7.159:8080";
    $scope.currentUser={};
    $scope.streams={};
    var usuario = JSON.parse(sessionStorage["user"]);

    function getStream(){
        if (sessionStorage["user"] != undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            $http.get(base_url + '/users/' + usuario.userid, {headers: {'x-access-token': usuario.token}})
                .success(function (data) {
                    console.log(data);
                    $scope.currentUser = data;

                }).error(function (err) {
                console.error(err);
            })
        }
        console.log($scope.currentUser.username);
        $http.get(base_url+'/stream')
            .success(function (data) {
                $scope.streams =data;

            })
            .error(function (err) {
                console.error(err);
            });
    }
    getStream();
    
    $scope.deleteStream=function(stream) {
        $http.delete(baseurl+'stream'+$scope.actualStream._id)
            .success(function () {
                getStream();
                $scope.actualStream=null;

            });

    };

    $scope.newStream = function(){
        if ($scope.this.value==IP) {
            $http.post(base_url + '/stream', {
                username: $scope.currentUser.username,
                drone: $scope.newStream.drone,
                streamIP: current
            }).success(function (data) {
                getStream();
            }).error(function (error, status, headers, config) {
                console.error(error);

            })
        }
        else{
            $http.post(base_url + '/stream', {
                username: $scope.currentUser.username,
                drone: $scope.newStream.drone,
                streamIP: $scope.newStream.ip
            }).success(function (data) {
                getStream();
            }).error(function (error, status, headers, config) {
                console.error(error);

            })
        }
    };
});