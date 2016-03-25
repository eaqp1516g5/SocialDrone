/**
 * Created by bernat on 25/03/16.
 */

angular.module('SocialDrone').controller('MainCtrl', function ($scope, $http) {
    var base_url = "http://localhost:8080";
    $scope.users = {};
    $scope.newUser={};
    $scope.deluser = {};
    $scope.updateUser = {};
    function getUsers() {
        $http.get(base_url + '/users')
            .success(function (data) {
                console.log(data);
                $scope.users = data;
            })
            .error(function (err) {
            });
    }
    getUsers();
    $scope.registrarUser= function () {
       console.log($scope.newUser);
        $http.post(base_url+'/users',{
            username: $scope.newUser.username,
            password: $scope.newUser.password,
            name: $scope.newUser.name,
            lastname: $scope.newUser.lastname,
            email: $scope.newUser.email
        }).success(function () {
                getUsers();
            })
            .error(function (error, status, headers, config) {
                console.log(error);
            });
    };

    $scope.deleteUser = function () {
        $http.delete(base_url+'/users/by/'+$scope.newUser.username).success(function(){
            getUsers()
        }).error(function (error, status, headers, config) {
                console.log(error);
            });
    };

    $scope.updateUser = function () {
        $http.put(base_url+'/users/'+$scope.newUser.username,{
            username: $scope.newUser.username,
            password: $scope.newUser.password,
            name: $scope.newUser.name,
            lastname: $scope.newUser.lastname,
            email: $scope.newUser.email
        }).success(function () {
                getUsers();
            })
            .error(function (error, status, headers, config) {
                console.log(error);
            });
    }
});