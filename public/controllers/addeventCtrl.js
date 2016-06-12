angular.module('SocialDrone').controller('addeventCtrl',['$scope','$http','socketio','$timeout', function ($scope, $http,socket, $timeout) {
    var base_url = "http://localhost:8080";
    var center = new google.maps.LatLng(51,-0.12);
    var mapa;
    var marker;
    $scope.user={};
    $scope.event={};
    a= new Date();
    var d = new Date(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes());
    $scope.time = d;
    getuser=function(){
        if(sessionStorage["user"]!=undefined){
            $scope.user=JSON.parse(sessionStorage["user"]);
        }
    };
    getuser();
    $scope.createEvent= function () {
        if ($scope.event.name!=undefined && $scope.event.description!=undefined && $scope.event.lat!=undefined &&$scope.event.long!=undefined){
            $http.post(base_url+'/event',{
                name: $scope.event.name,
                description: $scope.event.description,
                lat: $scope.event.lat,
                long: $scope.event.long,
                Date: $scope.time,
                hour: ("0" + $scope.time.getHours()).slice(-2) + ":" + ("0"+$scope.time.getMinutes()).slice(-2),
                token:  $scope.user.token,
                userid:  $scope.user.userid,
                location: [$scope.event.long, $scope.event.lat]
            }).success(function (data) {
                if(data!="No tengo tokencito"){
                    sessionStorage["eventoid"]=JSON.stringify(data);
                    window.location.replace(base_url+"/even");
                    socket.emit('event',$scope.user.userid, function(data){
                    } )
                }else
                    $timeout(function() {
                        swal("Canceled", "Only registered users can create events", "error");
                    })
            }).error(function (error, status, headers, config) {
                $timeout(function() {
                    swal("Canceled", error, "error");
                })
            });
        }
        else {
            if($scope.event.lat!=undefined)
            $timeout(function() {
                swal("Canceled", 'All the fields are required', "error");
            })
            else
                $timeout(function() {
                    swal("Canceled", 'Select the place in the map', "error");
                })
        }
    };
    function placeMarker(location, ma){
        marker=new google.maps.Marker({
            position: location,
            map: ma
        })
        $scope.event.lat= location.lat();
        $scope.event.long=location.lng();
        ma.panTo(location);
    }
    mapeando=function (){
        var map1={
            center: center,
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var mapa = new google.maps.Map(document.getElementById("map"),map1);
        google.maps.event.addListener(mapa, 'click', function(event){
            if (marker==undefined) {
                placeMarker(event.latLng, mapa);
            }
            else{
                marker.setMap(null);
                placeMarker(event.latLng, mapa);
            }
        })
    }
    mapeando();
}]);