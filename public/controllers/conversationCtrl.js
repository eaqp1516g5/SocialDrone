
/**
 * Created by Admin on 30/05/2016.
 */
angular.module('SocialDrone').controller('conversationCtrl',['$scope','$http','socketio','$timeout', function ($scope, $http,socket,$timeout) {
    var base_url = "http://147.83.7.159:8080";
    $scope.message={};
    $scope.chat=[];
    if(sessionStorage['conver']!=null||sessionStorage['conver']!=undefined){
        if (sessionStorage["user"] != undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            $scope.usuar= usuario;
            var conver = JSON.parse(sessionStorage['conver']);
            console.log(conver);
            $http.get(base_url + '/chatt/conversation/' + conver._id, {headers: {'x-access-token': usuario.token}})
                .success(function (data) {
                    $scope.chat=data;
                    $timeout(function(){
                        var scroller = document.getElementById('chatscroll');
                        scroller.scrollTop=scroller.scrollHeight;
                    }, 0, false);
                    socket.emit('visto', {userid: usuario.userid, chat: conver._id});
                })
                .error(function (err) {
                    $timeout(function(){
                        swal("Error", err, "error");
                    })
                });
        }
        else{
            window.location.href='/';
        }}
        else{
        window.location.href='/';
    }
    $scope.sendMessage=function(){
        socket.emit('chatmessage',{userid: usuario.userid,text: $scope.message.text, chatid: conver._id});
    }
    socket.on('chatmessage', function(data){
        console.log(data);
        if(data.chatid._id==conver._id && window.location.href==base_url+'/chat') {
            $scope.chat.push(data);
            $scope.message = {};
            $timeout(function(){
                var scroller = document.getElementById('chatscroll');
                scroller.scrollTop=scroller.scrollHeight;
            }, 0, false);
            socket.emit('visto', {userid: usuario.userid, chat: conver._id});
        }
    })
    $http.get(base_url + '/users').success(function (data) {
        $scope.users = data;
        console.log("Obtengo users");
        console.log($scope.users);
    });
    var _selected;
    $scope.selected = undefined;
    $scope.onSelect = function ($item, $model, $label) {
        //window.location.href = "/user";
        $http.post(base_url+'/chatt/user', {
            token: usuario.token,
            user: $model._id,
            userid: usuario.userid,
            conversation_id: conver._id
        }).success(function (data) {
            $timeout(function(){
                swal("User added!", "The user "+ $model.username+" has added.", "success");
            });
        }).error(function (err) {
            $timeout(function() {
                swal("Cancelled", err, "error");
            });
        });
        $scope.$item = $item;
        $scope.$model = $model;
        $scope.$label = $label;
        $scope.userSelected = $model.username;

    };
    $scope.age = function(a){
        return new Date(a);
    }
    if (sessionStorage["user"] != undefined) {
        socket.emit('visto', {userid: usuario.userid, chat: conver._id});
    }else{
        window.location.href='/';
    }
}]);