angular.module('SocialDrone').controller('addeventCtrl', function ($scope, $http) {
    var base_url = "http://localhost:8080";
    var center = new google.maps.LatLng(51,-0.12);
    var mapa;
    var marker;
    $scope.event={};
    $scope.createEvent= function () {
        if ($scope.event.name!=undefined && $scope.event.description!=undefined && $scope.event.lat!=undefined &&$scope.event.long!=undefined){
            $http.post(base_url+'/event',{
                name: $scope.event.name,
                description: $scope.event.description,
                lat: $scope.event.lat,
                long: $scope.event.long
            }).success(function (data) {
                console.log(data);
            }).error(function (error, status, headers, config) {
                console.log(error);
            });
        }
    };
    function placeMarker(location, ma){
        marker=new google.maps.Marker({
            position: location,
            map: ma
        })
        $scope.event.lat=location.lat();
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
});