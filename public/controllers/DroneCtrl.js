/**
 * Created by kenshin on 28/03/16.
 */
angular.module('SocialDrone').controller('DroneCtrl'), function ($scope,$http, $alert, Alertify) {
    var base_url = "http://localhost:8080";
    var base_url_produccio = "http://147.83.7.159:8080";
    console.log("ENTRA");
    $scope.drones = {};
    $scope.newDrone={};
    $scope.deldrone = {};
    $scope.updateDrone = {};
    function getDrones() {
        $http.get(base_url + '/drone')
            .success(function (data) {
                console.log(data);
                $scope.drones = data;
            })
            .error(function (err) {
            });
    }
    getDrones();

    $scope.registerDrone= function () {
        console.log($scope.newDrone);
        $http.post(base_url+'/drones',{
            model: $scope.newDrone.model,
            vendor: $scope.newDrone.vendor,
            weight: $scope.newDrone.weight,
            battery: $scope.newDrone.battery,
            type: $scope.newDrone.type,
            imageUrl: $scope.newDrone.imageUrl,
            description: $scope.newDrone.description,
            releasedate: $scope.newDrone.releaseDate


        }).success(function (data) {
                var myAlert = $alert({
                    title: 'All the operations are done!',content:'Drone '+$scope.newDrone.model+" - "+$scope.newDrone.vendor, container:'#alerts-container',
                    placement: 'top', duration:3, type: 'success', show: true});
                getDrones();
                $scope.newDrone.model=null,
                $scope.newDrone.vendor=null,
                $scope.newDrone.weight=null,
                $scope.newDrone.battery=null,
                $scope.newDrone.type=null,
                $scope.newDrone.imageUrl=null,
                $scope.newDrone.description=null,
                $scope.newDrone.releaseDate=null
                console.log(myAlert);

            })
            .error(function (error, status, headers, config) {
                console.log(error);
                var myAlert = $alert({
                    title: 'Errorsito!', content: error, container:'#alerts-container',
                    placement: 'top', duration:3, type: 'danger', show: true});
                console.log(myAlert);
            });
    };
}