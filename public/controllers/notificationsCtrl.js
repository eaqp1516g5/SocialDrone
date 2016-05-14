/**
 * Created by Admin on 14/05/2016.
 */
angular.module('SocialDrone').controller('notificationsCtrl', function ($scope, $http) {
    var base_url = "http://localhost:8080";
    var socket_url = "http://localhost:3000";
    var socket = io(socket_url);
    $scope.notifications={};
    $scope.page1=0;
    $scope.page0=0;
    $scope.type=undefined;
    $scope.habilitar=false;
    $scope.habilitarmenos=true;
    $scope.page=0
    $scope.notification = function (page, i) {
        $scope.page=page;
        $scope.type=undefined;
        if(i==0){
            $scope.page1= $scope.page1-1
        }
        if (sessionStorage["user"] != undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            $http.get(base_url + '/notifications/page=' + page*5, {headers: {'x-access-token': usuario.token, userid: usuario.userid}})
                .success(function (data) {
                    $scope.notifications=data.data;
                    var a = data.pages/5;
                    if ($scope.page1+1<a){
                        $scope.page1=$scope.page1+1;
                        $scope.habilitar=false;
                    }
                    else{
                        $scope.habilitar=true;
                    }
                    if ($scope.page1==1&& $scope.habilitar==true){
                        $scope.habilitarmenos=false;
                    }
                    else if(a==1){
                        $scope.habilitarmenos=true;
                        $scope.habilitar=true;
                    }
                    else if($scope.page1>1){
                        $scope.habilitarmenos=false;
                        $scope.page0=$scope.page1-1;
                    }
                    else if($scope.page1==1){
                        $scope.habilitarmenos=true;
                    }
                })
                .error(function (err) {
                    console.log(err);
                });
        }
    }
    $scope.notification(0);
    $scope.notificationtype = function (type, page) {
        $scope.page=page;
        $scope.type=type;
        if (sessionStorage["user"] != undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            $http.get(base_url + '/notifications/type='+type+'/page=' + page*5, {headers: {'x-access-token': usuario.token, userid: usuario.userid}})
                .success(function (data) {
                    $scope.notifications=data.data;
                    var a = data.pages/5;
                    if ($scope.page1<a){
                        $scope.page1=$scope.page1+1;
                        $scope.habilitar=false;
                    }
                    else{
                        $scope.habilitar=true;
                    }
                    if ($scope.page1==1){
                        $scope.habilitarmenos=true;
                    }
                })
                .error(function (err) {
                    console.log(err);
                });
        }
    }
    $scope.deletenotify = function (type, id) {
        if (sessionStorage["user"] != undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            $http.delete(base_url + '/notifications/'+id, {headers: {'x-access-token': usuario.token, userid: usuario.userid}})
                .success(function (data) {
                    socket.emit('notification', usuario.userid, function(data){
                    } );
                    if(type==undefined) {
                        $scope.notification($scope.page);
                    }else $scope.notificationtype(type, $scope.page);

                })
                .error(function (err) {
                    console.log(err);
                });
        }
    }
    $scope.deleteall = function () {
        if (sessionStorage["user"] != undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            $http.delete(base_url + '/notifications/dele/all', {headers: {'x-access-token': usuario.token, userid: usuario.userid}})
                .success(function (data) {
                    $scope.notification($scope.page);
                    socket.emit('notification', usuario.userid, function(data){
                    } );
                })
                .error(function (err) {
                    console.log(err);
                });
        }
    }
    $scope.deletethis = function (type, page) {
        if (sessionStorage["user"] != undefined) {
            var a = page*5
            var usuario = JSON.parse(sessionStorage["user"]);
            $http.delete(base_url + '/notifications/delete/page=' + page, {headers: {'x-access-token': usuario.token, userid: usuario.userid}})
                .success(function (data) {
                    socket.emit('notification', usuario.userid, function(data){
                    } );
                    if($scope.page!=0){
                        $scope.page=$scope.page-1;
                    }
                    if(type==undefined) {
                        $scope.notification($scope.page);
                    }else $scope.notificationtype(type, $scope.page);
                })
                .error(function (err) {
                    console.log(err);
                });
        }
    }
});