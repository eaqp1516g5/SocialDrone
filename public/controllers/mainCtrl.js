/**
 * Created by bernat on 25/03/16.
 */

/**
 * Created by bernat on 25/03/16.
 */
angular.module('SocialDrone').controller('MainCtrl','SweetAlert', function ($scope, $http,$alert) {
    var base_url = "http://localhost:8080";
    $scope.users = {};
    $scope.newUser={};
    $scope.deluser = {};
    $scope.updateUser = {};
    function getUsers() {
        if(sessionStorage["user"]!=undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            $http.get(base_url + '/users', {headers: {'x-access-token': usuario.token}})
                .success(function (data) {
                    console.log(data);
                    $scope.users = data;
                })
                .error(function (err) {
                });
        }
    }

    $scope.selectUser= function (user) {
        $scope.newUser.username=user.username;
        $scope.newUser.lastname=user.lastname;
        $scope.newUser.password=user.password;
        $scope.newUser.name=user.name;
        $scope.newUser.mail=user.mail;

        $scope.selected=true;
    };
    getUsers();
    $scope.registrarUser= function () {
        console.log($scope.newUser.mail);
        console.log('Entro');
        $http.post(base_url+'/users',{
            username: $scope.newUser.username,
            password: $scope.newUser.password,
            name: $scope.newUser.name,
            lastname: $scope.newUser.lastname,
            mail: $scope.newUser.mail
        }).success(function (data) {
                getUsers();
                $scope.newUser.username=null;
                $scope.newUser.password=null;
                $scope.newUser.name=null;
                $scope.newUser.lastname=null;
                $scope.newUser.mail=null;
            
            })
            .error(function (error, status, headers, config) {
                console.log(error);
                console.log('**********************');
                swal({   title: "Error!",   text: error,   type: "error",   confirmButtonText: "Cool" });
            });
    };


    $scope.deleteUser = function () {
        $http.delete(base_url+'/users/'+$scope.newUser.username).success(function(){
            getUsers();
            var myAlert = $alert({
                title: 'All good!',content:'Good bye '+$scope.newUser.username, container:'#alerts-container',
                placement: 'top', duration:3, type: 'success', show: true});
            $scope.newUser.username=null;
            $scope.newUser.password=null;
            $scope.newUser.name=null;
            $scope.newUser.lastname=null;
            $scope.newUser.mail=null;
        }).error(function (error, status, headers, config) {
            console.log(error);
            var myAlert = $alert({
                title: 'Error!', content: error, container:'#alerts-container',
                placement: 'top', duration:3, type: 'danger', show: true});
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
                var myAlert = $alert({
                    title: 'All good!',content:'Data updated', container:'#alerts-container',
                    placement: 'top', duration:3, type: 'success', show: true});
                getUsers();
                $scope.newUser.username=null;
                $scope.newUser.password=null;
                $scope.newUser.name=null;
                $scope.newUser.lastname=null;
                $scope.newUser.mail=null;
            })
            .error(function (error, status, headers, config) {
                console.log(error);
                var myAlert = $alert({
                    title: 'Error!', content: error, container:'#alerts-container',
                    placement: 'top', duration:3, type: 'danger', show: true});
            });
    }
});