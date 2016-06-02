
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
                    console.log(data);
                    $scope.chat=data;
                    socket.emit('visto', {userid: usuario.userid, chat: conver._id});
                })
                .error(function (err) {
                    console.log(err);
                });
        }
    }
    $scope.sendMessage=function(){
        socket.emit('chatmessage',{userid: usuario.userid,text: $scope.message.text, chatid: conver._id});
    }
    socket.on('chatmessage', function(data){
        console.log(data);
        if(data.chatid._id==conver._id) {
            $scope.chat.push(data);
            $scope.message = {};
            socket.emit('visto', {userid: usuario.userid, chat: conver._id});
        }
    })

}]);