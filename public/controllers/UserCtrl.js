/**
 * Created by bernat on 8/05/16.
 */
angular.module('SocialDrone').controller('UserCtrl',['$http', '$scope', '$window','$rootScope', function ($http, $scope, $window, $rootScope) {
    var base_url = "http://localhost:8080";
    $scope.userSearch={};
    $scope.numFollowing={};
    $scope.numFollowers={};
    $scope.follow=false;
    $scope.follower=false;
    function getFollowing(userid) {
        $http.get(base_url+'/following/'+userid).success(function (data) {
            $scope.numFollowing=data.length;
            $scope.followings=data;
            if(data.length!=0)
                $scope.follow=true;
        }).error(function (err) {
            console.log(err)
        })
    }
    function getFollowers(userid) {
        $http.get(base_url+'/followers/'+userid).success(function (data) {
            console.log(data);
            $scope.numFollowers=data.length;
            $scope.followers=data;
            if(data.length!=0)
                $scope.follower=true;
        }).error(function (err) {
            console.log(err)
        })
    }
    function getUser() {
        var user = sessionStorage["userSearch"];
        console.log(user);
        $http.get(base_url+'/api/user/'+user).success(function (data) {
            $scope.userSearch=data;
            getFollowing(data._id);
            getFollowers(data._id);
        }).error(function (err) {
            console.log(err)
        })
    }

    getUser();
}]);