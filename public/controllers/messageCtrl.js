/**
 * Created by bernat on 26/03/16.
 */
angular.module('SocialDrone').controller('messageCtrl', function ($scope, $http) {
    alertify.confirm
    $scope.messages = {};
    $scope.newMessage = {};
    $http.get("http://localhost:8080/message") //hacemos get de todos los users
        .success(function(data){
            console.log(data);
            $scope.messages= data;
        })
        .error(function(err){
            var myAlert = $alert({
                title: 'Error!', content: error, container:'#alerts-container',
                placement: 'top', duration:3, type: 'danger', show: true});
        });
    $scope.enviarMensaje = function() {
        $http.post("http://localhost:8080/message", {
                username: $scope.newMessage.user,
                text: $scope.newMessage.message
            })
            .success(function (data, status, headers, config) {
                console.log(data);
                $http.get("http://localhost:8080/message") //hacemos get de todos los users
                    .success(function(data){
                        $scope.messages= data;
                    })
                    .error(function(err){
                        var myAlert = $alert({
                            title: 'Error!', content: error, container:'#alerts-container',
                            placement: 'top', duration:3, type: 'danger', show: true});
                    });
            })
            .error(function (error, status, headers, config) {
                console.log(error);
            });
    };
    $scope.borrarMensaje = function (id) {
        $http.delete("http://localhost:8080/message/" + id, {})
            .success(function (data, status, headers, config) {
                $http.get("http://localhost:8080/message") //hacemos get de todos los users
                    .success(function(data){
                        $scope.messages= data;
                    })
                    .error(function(err){
                        var myAlert = $alert({
                            title: 'Error!', content: error, container:'#alerts-container',
                            placement: 'top', duration:3, type: 'danger', show: true});
                    });
            })
            .error(function (error, status, headers, config) {
                console.log(error);
                var myAlert = $alert({
                    title: 'Error!', content: error, container:'#alerts-container',
                    placement: 'top', duration:3, type: 'danger', show: true});
            });
    }
});