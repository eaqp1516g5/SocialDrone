/**
 * Created by kenshin on 28/03/16.
 */
angular.module('SocialDrone').controller('streamCtrl', function ($scope, $http,$alert, $timeout, $route) {
    var base_url = "http://10.192.49.79:8080";
    var base_url_produccio = "http://147.83.7.159:8080";
    $scope.currentUser={};
    $scope.streams={};
    $scope.checkbox={value:false};
    $scope.actualstream={};
    $scope.streamIP={};
    function getStream(){
        if (sessionStorage["stream"]!=undefined)
        {
            $scope.actualStream= sessionStorage["stream"];
        }
        if (sessionStorage["user"] != undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            $http.get(base_url + '/users/' + usuario.userid, {headers: {'x-access-token': usuario.token}})
                .success(function (data) {
                    $scope.currentUser = data;

                }).error(function (err) {
                console.error(err);
            })
        }
        console.log($scope.currentUser.username);
        $http.get(base_url+'/stream')
            .success(function (data) {
                $scope.streams =data;

            })
            .error(function (err) {
                console.error(err);
            });
    }
    getStream();

    function loadStream() {
        if (sessionStorage["stream"] != undefined && sessionStorage["stream"] != 'undefined') {
            console.log("STREAM STORAGE:");
            console.log(sessionStorage["stream"]);

            $scope.actualstream = JSON.parse(sessionStorage["stream"]);
            $scope.streamIP = 'http://'+$scope.actualstream.streamIP + ':4000/camera/1465554048646.png';
            console.log(    $scope.streamIP )
            console.info("getting stream from" + $scope.streamIP);
             /*   var canvas = document.getElementById('myCanvas');
                var context = canvas.getContext('2d');
                var imageObj;
            $http.get($scope.actualstream.streamIP + ':4000/camera/1465554048646.png').success(function(data){
                imageObj= data;
            }
            ).error(function (err){
                console.error(err);
            })
            var img=document.getElementById("scream");
               // imageObj.onload = function() {
                    context.drawImage(imageObj, 69, 50);
              //  };
               /*/ //imageObj.src = $scope.streamIP;
           // $('#content-bottom').append('<img id="video" src="" />');

            // Update image at 20fps
            var videoImg = $("#video");
            videoImg.attr("src", 'http://'+$scope.actualstream.streamIP + ':4000'+'/camera/' + new Date().getTime());

            setInterval(function() {
                videoImg.attr("src", 'http://'+$scope.actualstream.streamIP + ':4000'+'/camera/' + new Date().getTime());
            }, 100);
        }
    };
loadStream();
   /* $scope.$apply(function () {
       // $timeout(function() {
            // anything you want can go here and will safely be run on the next digest.
            if ($scope.actualStream != null) {
                console.log("ACTUAL " + $scope.actualStream);
                $scope.streamIP = 'http://' + $scope.actualstream.streamIP + ':4000/camera/1465554048646.png' + '?' + new Date().getTime();
            }
       // })
    });*/

    $scope.deleteStream=function(stream) {
        $http.delete(base_url + '/stream/' + stream._id)
            .success(function () {
                getStream();
            });
    };


    $scope.putStream = function(st) {
        console.log("PUTTTT");
        console.log(st);
        sessionStorage["stream"]= JSON.stringify(st);

        if(sessionStorage["stream"]!=undefined && st!= undefined) {
            window.location.href = "/streamview";
        }
    }

    $scope.newStream = function(){
        if ($scope.newStream.drone!=undefined) {
            if ($scope.checkbox.value == true) {
                console.log("DRid " + $scope.newStream.drone);
                $http.post(base_url + '/stream', {
                    username: $scope.currentUser.username,
                    drone: $scope.newStream.drone,
                    streamIP: "current"
                }).success(function (data) {
                    getStream();
                }).error(function (error, status, headers, config) {
                    console.error(error);

                })
            }
            else {
                console.log("DRid " + $scope.newStream.drone);
                $http.post(base_url + '/stream', {
                    username: $scope.currentUser.username,
                    drone: $scope.newStream.drone,
                    streamIP: $scope.newStream.ip
                }).success(function (data) {
                    getStream();
                }).error(function (error, status, headers, config) {
                    console.error(error);

                })
            }
        }
        else
        {
            console.log("ELSEEE");
            swal( "Cancelled", " Please select the drone that you are going to stream", "error");


        }
    };
});