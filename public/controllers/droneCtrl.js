/**
 * Created by kenshin on 28/03/16.
 */
angular.module('SocialDrone').controller('DroneCtrl', function ($scope, $http,$alert, $timeout) {
    var base_url = "http://localhost:8080";
    var base_url_produccio = "http://147.83.7.159:8080";
    $scope.drones = {};
    $scope.newDrone={};
    $scope.TempDronsi={};
    $scope.user={};
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
     function getDronsito() {
       if (sessionStorage["dronsi"]!=undefined)
       {
             $scope.TempDronsi = JSON.parse(sessionStorage["dronsi"]);
           if(sessionStorage["user"]!=undefined){
               var usuario=JSON.parse(sessionStorage["user"]);
           }
             $scope.TempDronsi.ihave = false;
           $http.get(base_url + '/users/' +   usuario.userid, {headers: {'x-access-token':usuario.token}})
               .success(function (data) {
                   $scope.user = data;
                   console.log(data);
                   for (var i = 0; i < $scope.user.mydrones.length; i++) {
                       if ($scope.TempDronsi._id == $scope.user.mydrones[i]) {
                           $scope.TempDronsi.ihave = true;
                       }
                   }
               }).error(function(err){

           })
        }
    }
    getDrones();
    getDronsito();
    $scope.registerDrone= function () {
        var dronee= new FormData();
        dronee.append('model', $scope.newDrone.model);
        dronee.append('vendor',$scope.newDrone.vendor);
        dronee.append('description', $scope.newDrone.description);
        dronee.append('imageUrl', $('#imgInp')[0].files[0]);
        if ($scope.newDrone.model != undefined && $scope.newDrone.vendor != undefined && $scope.newDrone.description != undefined) {
            $http.post(base_url+'/dronesAdd',dronee).success(function (data) {
                    var myAlert = $alert({
                        title: 'All the operations are done!',content:'Drone '+$scope.newDrone.model+" - "+$scope.newDrone.vendor, container:'#alerts-container',
                        placement: 'top', duration:3, type: 'success', show: true});
                    getDrones();
                    $scope.newDrone.model=null;
                    $scope.newDrone.vendor=null;
                    $scope.newDrone.description=null;
                })
                .error(function (error, status, headers, config) {
                    var myAlert = $alert({
                        title: 'Errorsito!', content: error, container:'#alerts-container',
                        placement: 'top', duration:3, type: 'danger', show: true});
                });
        }

    };

    $scope.deleteDrone = function () {
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
                console.error(error);
                var myAlert = $alert({
                    title: 'Error!', content: error, container:'#alerts-container',
                    placement: 'top', duration:3, type: 'danger', show: true});
            });
    };
    $scope.putDronsito = function(dr) {
          sessionStorage["dronsi"]= JSON.stringify(dr);
          window.location.href= "/droneprofile";
        }
    $scope.addMyDronsi = function(){
        if(sessionStorage["user"]!=undefined){
            var usuario=JSON.parse(sessionStorage["user"]);
        }
        $http.post(base_url+"/user/addDr/"+$scope.TempDronsi._id , {
            token: usuario.token,
            userid: usuario.userid
        }
        )
            .success(function (data, status, headers, config) {
                $timeout(function(){
                    swal("Succed!", data, "success");
                })
                getDronsito();

            })
            .error(function (error, status, headers, config) {
                $timeout(function(){
                    swal("Error", error, "error");
                })
            });
    }
    $scope.deleteMyDronsi = function(){
        if(sessionStorage["user"]!=undefined){
            var usuario=JSON.parse(sessionStorage["user"]);
        }
        $http.delete(base_url+"/user/addDr/"+$scope.TempDronsi._id , {headers: {'x-access-token':usuario.token, userid: usuario.userid}}

        )
            .success(function (data, status, headers, config) {
                getDronsito();
                $timeout(function(){
                    swal("Succed", data, "success");
                })            })
            .error(function (error, status, headers, config) {
                $timeout(function(){
                    swal("Error", error, "error");
                })
            });
    }

});
