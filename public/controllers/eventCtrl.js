angular.module('SocialDrone').controller('eventCtrl', function ($scope, $http,$routeParams) {
    var base_url = "http://localhost:8080";
    $scope.object={};
    $scope.show={};
    $scope.user={};
    $scope.go={};
    getobject=function(){
        console.log("Entra");
        console.log(sessionStorage["eventoid"]);
        if(sessionStorage["eventoid"]!=undefined){
            if(sessionStorage["user"]!=undefined){
                $scope.user=JSON.parse(sessionStorage["user"]);
            }
            var object =JSON.parse(sessionStorage["eventoid"]);
            $http.get(base_url + '/event/' + object._id)
                .success(function (data) {
                    console.log(data);
                    $scope.object=data;
                    for(var i = 0; i<data.go.length; i++){
                        if($scope.user!={}){
                            console.log(data.go[i]);
                            if($scope.user.userid==data.go[i]){
                                $scope.show.id=data.go[i];
                                console.log("esta");
                            }
                        }
                    }
                })
                .error(function (err) {
                    console.log('Oh, something wrong');
                });
        }
        else window.location.replace(base_url);
    }
    getobject();
    $scope.goto=function(){
        $http.post(base_url+'/event/'+$scope.object._id,{
            token:  $scope.user.token,
            userid:  $scope.user.userid
        }).success(function (data) {
            console.log(data);
            if(data!="No tengo tokencito"){
                $scope.object=data;
                sessionStorage["eventoid"]=JSON.stringify(data);
                $scope.show.id=$scope.user.userid;
            }else console.log(data);
        }).error(function (error, status, headers, config) {
            console.log(error);
        });
    };
    $scope.dontgoto=function(){
        $http.post(base_url+'/goto/delete/'+$scope.object._id,{
            token:  $scope.user.token,
            userid:  $scope.user.userid
        }).success(function (data) {
            console.log(data);
            if(data!="No tengo tokencito"){
                sessionStorage["eventoid"]=JSON.stringify(data);
                $scope.object=data;
                $scope.show.id=undefined;
            }else console.log(data);
        }).error(function (error, status, headers, config) {
            console.log(error);
        });
    }
    $scope.goes=function(id){
        $http.get(base_url+'/eve/'+id
        ).success(function (data) {
                $scope.go=data;
        }).error(function (error, status, headers, config) {
            console.log(error);
        });
    }
});