/**
 * Created by kenshin on 28/03/16.
 */
angular.module('SocialDrone').controller('DroneCtrl', function ($scope, $http,$alert, $timeout) {
    var base_url = "http://147.83.7.159:8080";
    var base_url_produccio = "http://147.83.7.159:8080";
    $scope.drones = {};
    $scope.newDrone={};
    $scope.TempDronsi={};
    $scope.user={};
    $scope.deleteDrone = {};
    $scope.updateDrone = {};

    $scope.file_changed = function (element) {
        $scope.$apply(function (scope) {
            var photofile = element.files[0];
            console.log(photofile);
            var reader = new FileReader();
            reader.onload = function (e) {
                foto = e.target.result;
            };
            reader.readAsDataURL(photofile);
        });
    };

     function getDronsito() {
       if (sessionStorage["dronsi"]!=undefined)
       {
             $scope.TempDronsi = JSON.parse(sessionStorage["dronsi"]);
           if(sessionStorage["user"]!=undefined) {
               var usuario = JSON.parse(sessionStorage["user"]);

               $scope.TempDronsi.ihave = false;
               $http.get(base_url + '/users/' + usuario.userid, {headers: {'x-access-token': usuario.token}})
                   .success(function (data) {
                       $scope.user = data;
                       console.log(data);
                       for (var i = 0; i < $scope.user.mydrones.length; i++) {
                           if ($scope.TempDronsi._id == $scope.user.mydrones[i]._id) {
                               $scope.TempDronsi.ihave = true;
                           }
                       }
                   }).error(function (err) {

               })
           }
        }
    }
    getDronsito();
   
    $scope.registerDrone= function () {
        var dronee= new FormData();
        dronee.append('model', $scope.newDrone.model);
        dronee.append('vendor',$scope.newDrone.vendor);
        dronee.append('description', $scope.newDrone.description);
        dronee.append('imageUrl', $('#imgInp')[0].files[0]);
        if ($scope.newDrone.model != undefined && $scope.newDrone.vendor != undefined && $scope.newDrone.description != undefined) {
            $http.post(base_url+'/dronesAdd',dronee,{
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }}
            ).success(function (data) {
                    $timeout(function(){
                        swal("Succeed", "Drone added", "success");
                    })
                    $scope.getdrones($scope.page);
                    $scope.newDrone.model=null;
                    $scope.newDrone.vendor=null;
                    $scope.newDrone.description=null;
                })
                .error(function (error, status, headers, config) {
                    $timeout(function(){
                        swal("Error",error, "error");
                    })
                });
        }

    };

    $scope.deleteDrone = function (model) {
            $http.delete(base_url+'/drones/' + model._id).success(function(){
                $timeout(function(){
                    swal("Succeed", "Drone deleted", "success");
                })
                $scope.getdrones($scope.page);
                $scope.newDrone.model=null,
                    $scope.newDrone.vendor=null,
                    $scope.newDrone.imageUrl=null,
                    $scope.newDrone.description=null
            }).error(function (error, status, headers, config) {
                $timeout(function(){
                    swal("Error", error, "error");
                })
            });
    };
    $scope.deleteDroneprofile = function (model) {
        $http.delete(base_url+'/drones/' + model._id).success(function(){
            window.location.href='/';
        }).error(function (error, status, headers, config) {
            $timeout(function(){
                swal("Error", error, "error");
            })
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
    $scope.drones={};
    $scope.page1=0;
    $scope.page0=0;
    $scope.habilitar=false;
    $scope.habilitarmenos=true;
    $scope.page=0
    $scope.getdrones = function (page) {
            $scope.page = page;
            $scope.type = undefined;
            if (page == 0) {
                $scope.page1 = 0;
                $scope.page0 = 0;
            }
            if (sessionStorage["user"] != undefined) {
                var usuario = JSON.parse(sessionStorage["user"]);
            }
                $http.get(base_url + '/dronespag/' + page)
                    .success(function (data) {
                        $scope.drones = data.data;
                        var a = data.pages / 5;
                        if ($scope.page + 1 < a) {
                            $scope.page1 = $scope.page1 + 1;
                            $scope.habilitar = false;
                        }
                        else {
                            $scope.habilitar = true;
                        }
                        if ($scope.page == 1 && $scope.habilitar == true) {
                            $scope.habilitarmenos = false;
                        }
                        else if (a == 1) {
                            $scope.habilitarmenos = true;
                            $scope.habilitar = true;
                        }
                        else if ($scope.page >= 1) {
                            $scope.habilitarmenos = false;
                            $scope.page0 = $scope.page - 1;
                        }
                        else if ($scope.page == 0) {
                            $scope.habilitarmenos = true;
                        }
                    })
                    .error(function (err) {
                        $timeout(function() {
                            swal("Error", err, "error");
                        })
                    });

    }
    $scope.getdrones(0);
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
