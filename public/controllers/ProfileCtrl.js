/**
 * Created by bernat on 20/04/16.
 */
angular.module('SocialDrone').controller('ProfileCtrl',['$http', '$scope', '$window','$rootScope', function ($http, $scope, $window, $rootScope) {

    $scope.currentUser={};
    var base_url = "http://147.83.7.159:8080";
        function getUserSocial() {
            $http.get(base_url + '/profile')
                .success(function (data) {
                    $scope.currentUser=data;
                    sessionStorage["user"]=JSON.stringify(data);
                    window.location=base_url;
                })
                .error(function (err) {
                    console.log(err)
                });
        }
    getUserSocial();
}]);