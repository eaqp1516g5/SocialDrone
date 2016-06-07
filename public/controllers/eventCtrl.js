angular.module('SocialDrone').controller('eventCtrl', function ($scope, $http,$routeParams) {
    var base_url = "http://localhost:8080";
    $scope.object={};
    $scope.show={};
    $scope.user={};
    $scope.go={};
    $scope.err=false;
    mapeando=function (){
        console.log($scope.object.lat);
        console.log($scope.object.long);
        var map1={
            center: new google.maps.LatLng($scope.object.lat,$scope.object.long),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var mapa = new google.maps.Map(document.getElementById("map2"),map1);
        marker=new google.maps.Marker({
            position: new google.maps.LatLng($scope.object.lat,$scope.object.long),
            map: mapa
        })
        mapa.panTo(new google.maps.LatLng($scope.object.lat,$scope.object.long));
    }
    getobject=function(){
        if(sessionStorage["eventoid"]!=undefined&&sessionStorage["eventoid"]!='null'){
            if(sessionStorage["user"]!=undefined){
                $scope.user=JSON.parse(sessionStorage["user"]);
            }
            var object =JSON.parse(sessionStorage["eventoid"]);
            $http.get(base_url + '/event/' + object._id)
                .success(function (data) {
                    console.log(data);
                    $scope.object=data;
                    for(var i = 0; i<data.go.length; i++){
                        if($scope.user!={}){
                            console.log(data.go[i]);
                            if($scope.user.userid==data.go[i]){
                                $scope.show.id=data.go[i];
                                console.log("esta");
                            }
                        }
                    }
                    mapeando();
                })
                .error(function (err) {
                    swal("Error", err, "error");
                });
        }
        else $scope.err=true;
    }
    getobject();
    $scope.goto=function(){
        $http.post(base_url+'/event/'+$scope.object._id,{
            token:  $scope.user.token,
            userid:  $scope.user.userid
        }).success(function (data) {
            console.log(data);
            if(data!="No tengo tokencito"){
                $scope.object=data;
                sessionStorage["eventoid"]=JSON.stringify(data);
                $scope.show.id=$scope.user.userid;
            }else console.log(data);
        }).error(function (error, status, headers, config) {
            swal("Error", err, "error");
        });
    };
    $scope.borrarEvento=function (id) {
        console.log("voy a borrar un evento");
        $http.delete(base_url+'/borrarevento/'+id).success(function (data) {
            console.log(data);
        }).error(function (data) {
            console.log(data);
        })
    }
    $scope.dontgoto=function(){
        $http.post(base_url+'/goto/delete/'+$scope.object._id,{
            token:  $scope.user.token,
            userid:  $scope.user.userid
        }).success(function (data) {
            console.log(data);
            if(data!="No tengo tokencito"){
                sessionStorage["eventoid"]=JSON.stringify(data);
                $scope.object=data;
                $scope.show.id=undefined;
            }else console.log(data);
        }).error(function (error, status, headers, config) {
            swal("Error", err, "error");
        });
    }
    $scope.goes=function(id){
        $http.get(base_url+'/eve/'+id
        ).success(function (data) {
                $scope.go=data;
        }).error(function (error, status, headers, config) {
            swal("Error", err, "error");
        });
    }
});