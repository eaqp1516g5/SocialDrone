/**
 * Created by bernat on 25/03/16.
 */

angular.module('SocialDrone',['ngRoute', 'mgcrea.ngStrap','ngAnimate']).config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode( {enabled: true,
        requireBase: false});

    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl'
        })
        .when('/users', {
            templateUrl: 'views/users.html',
            controller: 'MainCtrl'
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        })
        .when('/signup', {
            templateUrl: 'views/signup.html',
            controller: 'SignupCtrl'
        })
        .when('/messages', {
            templateUrl: 'views/messages.html',
            controller: 'messageCtrl'
        })
        .when('/add', {
            templateUrl: 'views/add.html',
            controller: 'AddCtrl'
        })

        .when('/drones',{
            templateUrl: 'views/drone.html',
            controller: 'DroneCtrl'
        })
        .when('/dr', {
            redirectTo:'/drones'
        })
        .when('/enjoy', {
            redirectTo:'http://www.pornotube.com/'
        })
        .when('/drone', {
            redirectTo:'/drones'
        })
        .otherwise({
            redirectTo: '/'
        })
});

