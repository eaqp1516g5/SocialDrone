
/**
 * Created by Admin on 30/05/2016.
 */
angular.module('SocialDrone').controller('conversationCtrl',['$scope','$http','socketio','$routeParams', function ($scope, $http,socket, $routeParams) {
    var base_url = "http://localhost:8080";
    $scope.message={};
    $scope.chat=[];
            if (sessionStorage["user"] != undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            $scope.usuar= usuario;
            $http.get(base_url + '/chatt/conversation/' + $routeParams.id, {headers: {'x-access-token': usuario.token}})
                .success(function (data) {
                    $scope.chat=data;
                    socket.emit('visto', {userid: usuario.userid, chat: $routeParams.id});
                })
                .error(function (err) {
                    console.log(err);
                });
        }
    $scope.sendMessage=function(){
        socket.emit('chatmessage',{userid: usuario.userid,text: $scope.message.text, chatid: $routeParams.id});
    }
    socket.on('chatmessage', function(data){
        console.log(data);
        if(data.chatid._id==$routeParams.id && window.location.href==base_url+'/chat') {
            $scope.chat.push(data);
            $scope.message = {};
            socket.emit('visto', {userid: usuario.userid, chat: $routeParams.id});
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
            conversation_id: $routeParams.id
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
    socket.emit('visto', {userid: usuario.userid, chat: $routeParams.id});

}]);