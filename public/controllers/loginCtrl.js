/**
 * Created by bernat on 18/04/16.
 */

var Base_URL= 'http://localhost:8080';
angular.module('SocialDrone').controller('LoginCtrl',['$http', '$scope', '$window','$rootScope', function ($http, $scope, $window, $rootScope) {
    $scope.loginF=function () {
        $http.get('http://localhost:8080/auth/facebook').success(function (data) {
            console.log(data)  ;
        });
    }
}]);