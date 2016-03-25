/**
 * Created by bernat on 25/03/16.
 */

angular.module('SocialDrone').controller('MainCtrl', function ($scope, $http) {
    $scope.users = {};
    $scope.deluser = {};
    $scope.updateUser = {};
    $http.get("http://localhost:8080/users") //hacemos get de todos los users
        .success(function(data){
            console.log(data);
            $scope.users= data;
        })
        .error(function(err){
        });
});