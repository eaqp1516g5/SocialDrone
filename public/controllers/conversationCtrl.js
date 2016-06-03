
/**
 * Created by Admin on 30/05/2016.
 */
angular.module('SocialDrone').controller('conversationCtrl',['$scope','$http','socketio', function ($scope, $http,socket) {
    var base_url = "http://localhost:8080";
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
                    socket.emit('visto', {userid: usuario.userid, chat: conver._id});
                })
                .error(function (err) {
                    swal("Error", err, "error");
                });
        }
    }
    $scope.sendMessage=function(){
        socket.emit('chatmessage',{userid: usuario.userid,text: $scope.message.text, chatid: conver._id});
    }
    socket.on('chatmessage', function(data){
        console.log(data);
        if(data.chatid._id==conver._id && window.location.href==base_url+'/chat') {
            $scope.chat.push(data);
            $scope.message = {};
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
            swal("User added!", "The user "+ $model.username+" has added.", "success");
        }).error(function (err) {
            swal("Cancelled", err, "error");
        });
        $scope.$item = $item;
        $scope.$model = $model;
        $scope.$label = $label;
        $scope.userSelected = $model.username;

    };
    $scope.age = function(a){
        return new Date(a);
    }
    socket.emit('visto', {userid: usuario.userid, chat: conver._id});

}]);