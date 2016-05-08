angular.module('SocialDrone').controller('showeventCtrl', function ($scope, $http) {
    var base_url = "http://localhost:8080";
    $scope.show={};
    $scope.position={};
    $scope.show.km=0;
    var draw_circle;
    var lat= 0;
    var lng = 0;
    var center = new google.maps.LatLng(51,-0.12);
    var mapa;
    var zoom = 8;
    var marker;
    var infoWindow;

    initialize=function(){
        var map1={
            center: center,
            zoom: zoom,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        mapa = new google.maps.Map(document.getElementById("mapi"),map1);
        var mark = new google.maps.Marker({
            map: mapa,
            position: center
        });
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
            lat=place.geometry.location.lat();
            lng=place.geometry.location.lng();
            center = new google.maps.LatLng(place.geometry.location.lat(),place.geometry.location.lng());
            zoom = 12;
            initialize();
        }


    };
    var createMarker = function (info){
        marker = new google.maps.Marker({
            map: mapa,
            position: new google.maps.LatLng(info.lat, info.long),
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
        });
        (function(marker, info){
            google.maps.event.addListener(marker, 'click', function() {
                if(!infoWindow){
                    infoWindow=new google.maps.InfoWindow;
                }
                infoWindow.setContent('<h5>' + "Event name: "+ info.name+'</h5>'+'<h5>'+"Day: "+ info.day+'</h5>'+ '<h5>'+"Hour: "+ info.hour+'</h5>'+'<div align="center">'+'<button class="btn-primary" onclick="see(\''+info._id+'\');">See event</button>' +'</div>');
                infoWindow.open(mapa,marker);
            });
        })(marker, info);

        $scope.markers.push(marker);

    }

    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
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
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            zoom=12;
            initialize();
        }
    };
    function setMapOnAll(map) {
        for (var i = 0; i < $scope.markers.length; i++) {
            $scope.markers[i].setMap(map);
        }
    }
    $scope.search=function() {
        if(marker!=undefined){
            setMapOnAll(null);
            draw_circle.setMap(null);
        }
        if(draw_circle!=undefined) {
            draw_circle.setMap(null);
        }
        draw_circle = new google.maps.Circle({
            center: center,
            radius: $scope.show.km*1000,
            strokeColor: "#1E90FF",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#00BFFF",
            fillOpacity: 0.35,
            map: mapa
        });
        $http.post(base_url + "/events", {
                lat: lat,
                lng: lng,
                radius: $scope.show.km
            })
            .success(function (data, status, headers, config) {
                for (i = 0; i < data.length; i++){
                    createMarker(data[i]);
                }
            })
            .error(function (error, status, headers, config) {
                console.log(error);
            });
    };
    see=function(id) {
        console.log(id);
        $http.get(base_url + "/event/" + id)
            .success(function (data, status, headers, config) {
                sessionStorage["eventid"]=JSON.stringify(data);
                window.location.replace(base_url+"/even")
            })
            .error(function (error, status, headers, config) {
                console.log(error);
            });
    };


});