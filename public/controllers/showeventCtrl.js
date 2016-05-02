angular.module('SocialDrone').controller('showeventCtrl', function ($scope, $http) {
    var base_url = "http://localhost:8080";
    $scope.show={};
    $scope.position={};
    $scope.show.km=0;
    var center = new google.maps.LatLng(51,-0.12);
    var mapa;
    var zoom = 8;
    initialize=function(){
        var map1={
            center: center,
            zoom: zoom,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var mapa = new google.maps.Map(document.getElementById("map"),map1);
        var input = document.getElementById('searchid');
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.addListener('place_changed', function() {
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                window.alert("Autocomplete's returned place contains no geometry");
                return;
            }
            expandViewportToFitPlace(map1, place);

        });
        function expandViewportToFitPlace(map, place) {
            if (place.geometry.viewport) {
                center = new google.maps.LatLng(place.geometry.location.lat(),place.geometry.location.lng());
                zoom = 15;
                initialize();
            }
        }

    }
    initialize();
    google.maps.event.addDomListener(window, 'load', initialize)
    $scope.mylocation =function(){
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                x.innerHTML = "Geolocation is not supported by this browser.";
            }
        function showPosition(position) {
            center = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
            zoom=15;
            initialize();
        }
    }


});