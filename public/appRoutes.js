/**
 * Created by bernat on 25/03/16.
 */

angular.module('SocialDrone', ['ngRoute', 'infinite-scroll', 'mgcrea.ngStrap', 'ngAnimate', 'file-model', 'btford.socket-io', 'ui.bootstrap', 'ui.bootstrap.modal', 'angularMoment', 'ngSanitize'])
    .factory('socketio', ['$rootScope', function ($rootScope) {
        var socket_url = "http://10.192.49.79:3000";
        var socket = io.connect(socket_url);
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    })
                })
            },
            disconnect: function () {
                socket.disconnect();
            },
            socket: socket

        }


    }])
    .config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

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
                templateUrl: 'views/fb.html',
                controller: 'ProfileCtrl'
            })
            .when('/adminusers', {
                templateUrl: 'views/users.html',
                controller: 'MainCtrl'
            })
            .when('/user', {
                templateUrl: 'views/userProfile.html',
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
            .when('/add', {
                templateUrl: 'views/add.html',
                controller: 'AddCtrl'
            })
            .when('/listdrones', {
                templateUrl: 'views/drone.html',
                controller: 'DroneCtrl'
            })
            .when('/perfiluser', {
                templateUrl: 'views/profile.html',
                controller: 'LoginCtrl'
            })
            .when('/drone', {
                redirectTo: '/listdrones'
            })
            .when('/droneprofile', {
                templateUrl: 'views/droneprofile.html',
                controller: 'DroneCtrl'
            })
            .when('/addevent', {
                templateUrl: 'views/addevent.html',
                controller: 'addeventCtrl'
            })
            .when('/messages', {
                templateUrl: 'views/messages.html',
                controller: 'messagetCtrl'
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
            .when('/notifications', {
                templateUrl: 'views/notifications.html',
                controller: 'notificationsCtrl'
            })
            .when('/chat', {
                templateUrl: 'views/chat.html',
                controller: 'conversationCtrl'
            })
            .when('/hashtags:tag', {
                templateUrl: 'views/home.html',
                controller: 'hashtagCtrl'
            })
            .when('/conversations', {
                templateUrl: 'views/conversations.html',
                controller: 'chatCtrl'
            })
            .when('/streamlist', {
                templateUrl: 'views/stream.html',
                controller: 'streamCtrl'
            })
            .when('/streamview', {
                templateUrl: 'views/streamview.html',
                controller: 'streamCtrl'
            })
            .otherwise({
                redirectTo: '/'
            })
    });
