/**
 * Created by bernat on 26/03/16.
 */
angular.module('SocialDrone').controller('HomeCtrl', function ($scope, $http) {
    $scope.messages = {};
    $scope.message1 = {};
    $scope.newMessage = {};
    $scope.comment = {};
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
    $scope.enviarMensaje = function(id) {
        if(id==undefined) {
            $http.post(base_url + "/message", {
                    username: "usuario",
                    text: $scope.newMessage.message
                })
                .success(function (data, status, headers, config) {
                    console.log(data);
                    $http.get(base_url + "/message") //hacemos get de todos los users
                        .success(function (data) {
                            $scope.messages = data;
                        })
                        .error(function (err) {
                            var myAlert = $alert({
                                title: 'Error!', content: error, container: '#alerts-container',
                                placement: 'top', duration: 3, type: 'danger', show: true
                            });
                        });
                })
                .error(function (error, status, headers, config) {
                    console.log(error);
                });
        }else{
            $http.post(base_url + "/message/" + id, {
                    username: "usuario",
                    text: $scope.newMessage.message
                })
                .success(function (data, status, headers, config) {
                    $http.get(base_url + "/message/" + id) //hacemos get de todos los users
                        .success(function (data) {
                            $scope.message1 = data[0];
                            $scope.comment = data[0].comment;
                        })
                        .error(function (err) {
                            var myAlert = $alert({
                                title: 'Error!', content: error, container: '#alerts-container',
                                placement: 'top', duration: 3, type: 'danger', show: true
                            });
                        });
                })
                .error(function (error, status, headers, config) {
                    console.log(error);
                });
        }
    };
    $scope.borrarComment = function (id, idc) {
        $http.delete(base_url+"/message/" + id +"/"+ idc, {})
            .success(function (data, status, headers, config) {
                $http.get(base_url+"/message/"+id) //hacemos get de todos los users
                    .success(function(data){
                        $scope.message1= data[0];
                        $scope.comment = data[0].comment;
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
    $scope.LikeMensaje = function (id) {
        $http.post(base_url+"/message/" + id +"/like" , {})
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
    $scope.LikeComment = function (id, idc) {
        $http.post(base_url+"/message/" + id + "/" + idc + "/like" , {})
            .success(function (data, status, headers, config) {
                $http.get(base_url+"/message/" + id)
                    .success(function(data){
                        console.log(data);
                        $scope.comment = data[0].comment;
                        $scope.message1 = data[0];
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
    $scope.verMensaje = function(id) {
        $http.get(base_url+"/message/" + id) //hacemos get de todos los users
            .success(function(data){
                $scope.comment = data[0].comment;
                $scope.message1 = data[0];
            })
            .error(function(err){
                var myAlert = $alert({
                    title: 'Error!', content: error, container:'#alerts-container',
                    placement: 'top', duration:3, type: 'danger', show: true});
            });
    };
    $scope.LikeMensajeint = function (id) {
        $http.post(base_url+"/message/" + id +"/like" , {})
            .success(function (data, status, headers, config) {
                $http.get(base_url+"/message/" + id) //hacemos get de todos los users
                    .success(function(data){
                        $scope.message1= data[0];
                        $scope.comment = data[0].comment;
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