angular.module('SocialDrone').controller('eventCtrl', function ($scope, $http,$routeParams) {
    var base_url = "http://localhost:8080";
    $scope.object=$routeParams.eventid;
    console.log(eventid);
});