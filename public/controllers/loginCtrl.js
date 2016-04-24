/**
 * Created by bernat on 18/04/16.
 */

var Base_URL= 'http://localhost:8080';
angular.module('SocialDrone').controller('LoginCtrl',['$http', '$scope', '$window','$rootScope', function ($http, $scope, $window, $rootScope) {
    $scope.newUser={};
    $scope.usuar={};
    $scope.loginUser={};
    $scope.registrar={};
    $scope.currentUser={};
    var base_url = "http://localhost:8080";
    $scope.loginF=function () {
        $http.get('http://localhost:8080/auth/facebook').success(function (data) {
            console.log(data)  ;
        });
    };
    getUser();
    function getUser() {
        if(sessionStorage["user"]!=undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            $http.get(base_url + '/users/' + usuario.userid, {headers: {'x-access-token': usuario.token}})
                .success(function (data) {
                    $scope.currentUser = data;
                    sessionStorage["userInfo"] = data;
                })
                .error(function (err) {
                });
        }
    }
    $scope.registrarUser= function () {
        if ($scope.newUser.username!=undefined && $scope.newUser.password!=undefined && $scope.newUser.name!=undefined && $scope.newUser.lastname!=undefined && $scope.newUser.mail!=undefined){
        $http.post(base_url+'/users',{
            username: $scope.newUser.username,
            password: $scope.newUser.password,
            name: $scope.newUser.name,
            lastname: $scope.newUser.lastname,
            mail: $scope.newUser.mail
        }).success(function (data) {
                $scope.newUser.username=null;
                $scope.newUser.password=null;
                $scope.newUser.name=null;
                $scope.newUser.lastname=null;
                $scope.newUser.mail=null;
                $scope.Regist(true);
            })
            .error(function (error, status, headers, config) {
                console.log(error);
            });
        }
    };
    $scope.loginUser= function () {
        if ($scope.loginUser.username!=undefined && $scope.loginUser.password!=undefined){
            $http.post(base_url+'/authenticate',{
                username: $scope.loginUser.username,
                password: $scope.loginUser.password,
            }).success(function (data) {
                    $scope.loginUser.username=null;
                    $scope.loginUser.password=null;
                    sessionStorage["user"]=JSON.stringify(data);
                    window.location = base_url;
                })
                .error(function (error, status, headers, config) {
                    console.log(error);
                });
        }
    };
    $scope.Regist=function (re) {
        $scope.registrar=re;
    };

   $scope.logout=function (userid) {
       if (sessionStorage["user"]!=undefined) {
           $scope.usuar = JSON.parse(sessionStorage["user"]);
           $http.delete(base_url+'/authenticate/'+userid, {headers: {'x-access-token': $scope.usuar.token}

           }).success(function () {
               sessionStorage.removeItem("user");
               window.location=base_url;
           }).error(function (err) {
               console.log(err);
           })
       }
       /*
           $http.delete(base_url+'/authenticate/'+userid, {
           }).success(function () {
               window.location(base_url);
               sessionStorage.removeItem("user");
           }).error(function (err) {
               console.log(err)
           })
       }*/

     //  else
           //console.log('Error userid');
   }


}]);