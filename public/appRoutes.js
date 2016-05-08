/**
 * Created by bernat on 25/03/16.
 */

angular.module('SocialDrone',['ngRoute', 'mgcrea.ngStrap','ngAnimate', 'file-model', 'ui.bootstrap','ui.bootstrap.modal']).config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode( {enabled: true,
       requireBase: false});

    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeCtrl'
        })
        .when('/auth/facebook', {
            templateUrl: 'http://localhost:8080/auth/facebook',
            controller: 'HomeCtrl'
        })
        .when('/social', {
            templateUrl: 'views/profile.html',
            controller: 'ProfileCtrl'
        })
        .when('/users', {
            templateUrl: 'views/users.html',
            controller: 'MainCtrl'
        })
        .when('/user', {
            templateUrl:'views/userProfile.html',
            controller:'UserCtrl'
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        })
        .when('/signup', {
            templateUrl: 'views/signup.html',
            controller: 'SignupCtrl'
        })
        .when('/add', {
            templateUrl: 'views/add.html',
            controller: 'AddCtrl'
        })
        .when('/drones',{
            templateUrl: 'views/drone.html',
            controller: 'DroneCtrl'
        })
        .when('/perfiluser', {
            templateUrl: 'views/profile.html',
            controller: 'LoginCtrl'
        })
        .when('/drone', {
            redirectTo:'/drones'
        })
        .when('/droneprofile',{
          templateUrl: 'views/droneprofile.html',
          controller: 'DroneCtrl'
        })
        .when('/addevent', {
            templateUrl: 'views/addevent.html',
            controller: 'addeventCtrl'
        })
        .when('/enjoy', {
          redirectTo:'http:www.pornotube.com'
        })
        .when('/legislation', {
            templateUrl: 'views/legislation_ES.html'
        })
        .when('/even', {
            templateUrl: 'views/event.html',
            controller: 'eventCtrl'
        })
        .when('/showevents', {
            templateUrl: 'views/showevents.html',
            controller: 'showeventCtrl'
        })
        .otherwise({
            redirectTo: '/'
        })
});
