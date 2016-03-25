/**
 * Created by bernat on 23/03/16.
 */


angular.module('SocialDrone', ['ngResource', 'ngMessages', 'ngRoute', 'mgcrea.ngStrap'])
    .config(function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

       /* $routeProvider
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'MainCtrl'
            })
            .when('/users', {
                templateUrl: 'views/users.html',
                controller: 'UserCtrl'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .when('/signup', {
                templateUrl: 'views/signup.html',
                controller: 'SignupCtrl'
            })
            .when('/message', {
                templateUrl: 'views/message.html',
                controller: 'MessageCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });*/

    });