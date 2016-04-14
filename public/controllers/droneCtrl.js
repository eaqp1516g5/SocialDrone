/**
 * Created by kenshin on 28/03/16.
 */
angular.module('SocialDrone').controller('DroneCtrl', function ($scope, $http,$alert, Alertify) {
    var base_url = "http://localhost:8080";
    var base_url_produccio = "http://147.83.7.159:8080";
    $scope.drones = {};
    $scope.newDrone={};
    $scope.deleteDrone = {};
    $scope.updateDrone = {};
    function getDrones() {
        $http.get(base_url + '/drones')
            .success(function (data) {
                console.log(data);
                $scope.drones = data;
            })
            .error(function (err) {
		console.error(err);
            });
    }
    getDrones();

    $scope.registerDrone= function () {
    console.info("a new drone is being  posted");
    console.log($scope.newDrone);
console.log("txatxi");
        $http.post(base_url+'/drones',{
            model: $scope.newDrone.model,
            vendor: $scope.newDrone.vendor,
            weight: $scope.newDrone.weight,
            battery: $scope.newDrone.battery,
            type: $scope.newDrone.type,
            imageUrl: $scope.newDrone.imageUrl,
            description: $scope.newDrone.description,
            releasedate: null

        }).success(function (data) {
                console.info("Todo ha ido de puta madre!");
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
                
console.log("errorsitoooooo");
                console.error(error);
		console.log($scope.newDrone.model+" "+
                $scope.newDrone.vendor+" "+
                $scope.newDrone.weight+" "+
                $scope.newDrone.battery+" "+
                $scope.newDrone.type+" "+
                $scope.newDrone.imageUrl+" "+
                $scope.newDrone.description+" "+
                $scope.newDrone.releaseDate
);
                var myAlert = $alert({
                    title: 'Errorsito!', content: error, container:'#alerts-container',
                    placement: 'top', duration:3, type: 'danger', show: true});
                console.log(myAlert);
            });
    };

    $scope.deleteDrone = function () {
        Alertify.confirm('Are you sure?').then(function () {
            $http.delete(base_url+'/drones/by/'+$scope.newDrone.model).success(function(){
                getDrones();
                var myAlert = $alert({
                    title: 'All good!',content:'Good bye '+$scope.newDrone.model, container:'#alerts-container',
                    placement: 'top', duration:3, type: 'success', show: true});
                      $scope.newDrone.model=null,
                    $scope.newDrone.vendor=null,
                    $scope.newDrone.weight=null,
                    $scope.newDrone.battery=null,
                    $scope.newDrone.type=null,
                    $scope.newDrone.imageUrl=null,
                    $scope.newDrone.description=null,
                    $scope.newDrone.releaseDate=null
            }).error(function (error, status, headers, config) {
                console.log(error);
                var myAlert = $alert({
                    title: 'Error!', content: error, container:'#alerts-container',
                    placement: 'top', duration:3, type: 'danger', show: true});
            });
        });

    };
    $scope.updateDrone = function () {
        $http.put(base_url+'/drones/'+$scope.newDrone.model,{
            vendor: $scope.newDrone.vendor,
            weight: $scope.newDrone.weight,
            battery: $scope.newDrone.battery,
            type: $scope.newDrone.type,
            imageUrl: $scope.newDrone.imageUrl,
            description: $scope.newDrone.description,
            releasedate: $scope.newDrone.releaseDate
        }).success(function () {
                var myAlert = $alert({
                    title: 'Everithing Right!',content:'Drone updated', container:'#alerts-container',
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
            })
            .error(function (error, status, headers, config) {
                console.log(error);
                var myAlert = $alert({
                    title: 'Error!', content: error, container:'#alerts-container',
                    placement: 'top', duration:3, type: 'danger', show: true});
            });
    }
});