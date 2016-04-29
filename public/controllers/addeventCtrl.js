angular.module('SocialDrone').controller('addeventCtrl', function ($scope, $http) {
    var center = new google.maps.LatLng(51,-0.12);
    mapeando=function (){
        var map1={
            center: center,
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var mapa = new google.maps.Map(document.getElementById("map"),map1);
    }
    mapeando();
});