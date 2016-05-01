angular.module('SocialDrone').controller('addeventCtrl', function ($scope, $http) {
    var base_url = "http://localhost:8080";
    var center = new google.maps.LatLng(51,-0.12);
    var mapa;
    var marker;
    a= new Date();
    var d = new Date(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes());
    $scope.time = d;
    $scope.date = d;
    $scope.createEvent= function () {
        console.log(("0" + $scope.time.getHours()).slice(-2) + ":" + ("0"+$scope.time.getMinutes()).slice(-2));
        console.log($scope.date.getMonth());
        console.log(d);
        if ($scope.event.name!=undefined && $scope.event.description!=undefined && $scope.event.lat!=undefined &&$scope.event.long!=undefined){
            $http.post(base_url+'/event',{
                name: $scope.event.name,
                description: $scope.event.description,
                lat: $scope.event.lat,
                long: $scope.event.long,
                Date: d,
                hour: ("0" + $scope.time.getHours()).slice(-2) + ":" + ("0"+$scope.time.getMinutes()).slice(-2),
                day: ("0" + $scope.date.getDay()).slice(-2) + "/" + ("0"+$scope.date.getMonth()+1).slice(-2) + "/" + ("0"+$scope.date.getDay()).slice(-2)
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