/**
 * Created by bernat on 20/04/16.
 */
angular.module('SocialDrone').controller('ProfileCtrl',['$http', '$scope', '$window','$rootScope', function ($http, $scope, $window, $rootScope) {

    $scope.currentUser={};
    base_url='http://localhost:8080';
        function getUserSocial() {
            console.log('Entro');
            $http.get(base_url + '/profile')
                .success(function (data) {
                    console.log('22222222222');
                    console.log(data);
                    $scope.currentUser=data;
                    sessionStorage["user"]=JSON.stringify(data);
                    console.log($scope.currentUser);
                    window.location=base_url;
                })
                .error(function (err) {
                    console.log('Error')
                    console.log(err)
                });
        }
    getUserSocial();
}]);