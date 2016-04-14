/**
 * Created by bernat on 26/03/16.
 */
angular.module('SocialDrone').controller('messageCtrl', function ($scope, $http) {
    $scope.messages = {};
    $scope.newMessage = {};
    var base_url_produccio = "http://147.83.7.159:8080";
    var base_url = "http://localhost:8080";
    $http.get(base_url+"/message") //hacemos get de todos los users
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
        $http.post(base_url+"/message", {
                username: $scope.newMessage.user,
                text: $scope.newMessage.message
            })
            .success(function (data, status, headers, config) {
                console.log(data);
                $http.get(base_url+"/message") //hacemos get de todos los users
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
        $http.delete(base_url+"/message/" + id, {})
            .success(function (data, status, headers, config) {
                $http.get(base_url+"/message") //hacemos get de todos los users
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