angular.module("ListarSocialDrone",[])
    .controller("FirstController",function($scope,$http){
        $scope.newPost = {};
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
                    $scope.posts.push($scope.newPost);
                    $scope.addPost = {}; //limpiamos
                })
                .error(function (error, status, headers, config) {
                    console.log(error);
                });
        }
    });