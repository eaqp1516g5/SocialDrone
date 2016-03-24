/**
 * Created by bernat on 23/03/16.
 */

angular.module('MessageService', []).factory('Message', ['$http', function ($http) {
    return{
        get: function () {

            return $http.get('/message');

        }
    }
}]);