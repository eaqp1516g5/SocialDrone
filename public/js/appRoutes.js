/**
 * Created by bernat on 23/03/16.
 */
angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider',function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainCtrl'
        })
        .when('/users', {
            templateUrl: 'views/users.html',
            controller: 'UserCtrl'
        })
        .when('/messages', {
            templateUrl: 'views/message.html',
            controller: 'MessageCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

}]);