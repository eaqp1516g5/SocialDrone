angular.module("ListarSocialDrone",[])
    .controller("FirstController",function($scope,$http){
        $scope.users = {};
        $scope.newPost = {};
        $scope.deluser = {};
        $scope.MessagePost = {};

        $http.get("http://localhost:3000/users") //hacemos get de todos los users
            .success(function(data){
                console.log(data);
                $scope.users= data;
            })
            .error(function(err){

            });
        $scope.addUser = function() {
            $http.post("http://localhost:3000/users", {
                    username: $scope.newPost.username,
                    password: $scope.newPost.password,
                    email: $scope.newPost.email,
                    gender: $scope.newPost.gender,
                    address: $scope.newPost.address


                })
                .success(function (data, status, headers, config) {
                    console.log(data);
                    //$scope.posts.push($scope.newPost);
                   // $scope.addPost = {}; //limpiamos
                    $http.get("http://localhost:3000/users") //hacemos get de todos los users
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
        $scope.deleteUser = function (id) {
            $http.delete("http://localhost:3000/user/" + id, {})
                .success(function (data, status, headers, config) {
                    console.log("Borraaado");
                    $http.get("http://localhost:3000/users") //hacemos get de todos los users
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
        $scope.addMessage = function() {
            $http.post("http://localhost:3000/message", {
                    username: marc,
                    text: $scope.MessagePost.text
                })
                .success(function (data, status, headers, config) {
                    console.log(data);
                    //$scope.posts.push($scope.newPost);
                    // $scope.addPost = {}; //limpiamos
                    $http.get("http://localhost:3000/message") //hacemos get de todos los users
                        .success(function(data){
                            console.log(data);
                        })
                        .error(function(err){

                        });
                })
                .error(function (error, status, headers, config) {
                    console.log(error);
                });
        }

    });