/**
 * Created by bernat on 25/03/16.
 */

angular.module('SocialDrone').controller('MainCtrl', function ($scope, $http) {
    $scope.users = {};
    $scope.deluser = {};
    $scope.updateUser = {};
    $scope.newUser = {};
    $http.get("http://localhost:8080/users") //hacemos get de todos los users
        .success(function(data){
            console.log(data);
            $scope.users= data;
        })
        .error(function(err){
        });
    $scope.registrarPersona = function() {
        $http.post("http://localhost:8080/users", {
                username: $scope.newUser.username,
                name: $scope.newUser.name,
                password: $scope.newUser.password,
                mail: $scope.newUser.mail,
                gender: $scope.newUser.gender,
                address: $scope.newUser.address,
                lastname: $scope.newUser.lastname


            })
            .success(function (data, status, headers, config) {
                console.log(data);
                $http.get("http://localhost:8080/users") //hacemos get de todos los users
                    .success(function(data){
                        console.log(data);
                        $scope.users= data;
                    })
                    .error(function(err){

                    });
            })
            .error(function (error, status, headers, config) {
                console.log(error);
            });
    }
    $scope.borrarPersona = function (id) {
        $http.delete("http://localhost:8080/users/" + id, {})
            .success(function (data, status, headers, config) {
                $http.get("http://localhost:8080/users") //hacemos get de todos los users
                    .success(function(data){
                        console.log(data);
                        $scope.users= data;
                    })
                    .error(function(err){

                    });
            })
            .error(function (error, status, headers, config) {
                console.log(error);
            });
    }
    $scope.modificarPersona = function (id) {
        var leng = id.length;
        $http.put("http://localhost:8080/users/" + id[leng-1].username, {
                username: $scope.newUser.username,
                name: $scope.newUser.name,
                password: $scope.newUser.password,
                mail: $scope.newUser.mail,
                gender: $scope.newUser.gender,
                address: $scope.newUser.address,
                lastname: $scope.newUser.lastname


            })
            .success(function (data, status, headers, config) {
                console.log(data);
                $http.get("http://localhost:8080/users") //hacemos get de todos los users
                    .success(function(data){
                        $scope.users= data;
                    })
                    .error(function(err){

                    });
            })
            .error(function (error, status, headers, config) {
                console.log(error);
            });

    }

});