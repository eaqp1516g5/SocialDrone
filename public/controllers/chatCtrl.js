

angular.module('SocialDrone').controller('chatCtrl', function ($scope, $http, $timeout) {
    var base_url = "http://147.83.7.159:8080";
    $scope.conversations={};
    $scope.page1=0;
    $scope.page0=0;
    $scope.type=undefined;
    $scope.habilitar=false;
    $scope.habilitarmenos=true;
    $scope.page=0
    $scope.convers = function (page, i) {
        if(i!=undefined){
            $scope.converstype(i, page);
        }
        else {
            $scope.page = page;
            $scope.type = undefined;
            if (page == 0) {
                $scope.page1 = 0;
                $scope.page0 = 0;
            }
            if (sessionStorage["user"] != undefined) {
                var usuario = JSON.parse(sessionStorage["user"]);
                $http.get(base_url + '/chatt/page=' + page, {
                        headers: {
                            'x-access-token': usuario.token,
                            userid: usuario.userid
                        }
                    })
                    .success(function (data) {
                        $scope.conversations = data.data;
                        var a = data.pages / 5;
                        if ($scope.page + 1 < a) {
                            $scope.page1 = $scope.page1 + 1;
                            $scope.habilitar = false;
                        }
                        else {
                            $scope.habilitar = true;
                        }
                        if ($scope.page == 1 && $scope.habilitar == true) {
                            $scope.habilitarmenos = false;
                        }
                        else if (a == 1) {
                            $scope.habilitarmenos = true;
                            $scope.habilitar = true;
                        }
                        else if ($scope.page >= 1) {
                            $scope.habilitarmenos = false;
                            $scope.page0 = $scope.page - 1;
                        }
                        else if ($scope.page == 0) {
                            $scope.habilitarmenos = true;
                        }
                    })
                    .error(function (err) {
                        $timeout(function() {
                            swal("Error", err, "error");
                        })
                    });
            }else{
                window.location.href='/';
            }
        }
    }
    $scope.convers(0);
    $scope.converstype = function (type, page) {
        $scope.page=page;
        $scope.type=type;
        if(page==0){
            $scope.page1=0;
            $scope.page0=0;
        }
        if (sessionStorage["user"] != undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            $http.get(base_url + '/chatt/type='+$scope.type+'/page=' + page, {headers: {'x-access-token': usuario.token, userid: usuario.userid}})
                .success(function (data) {
                    $scope.conversations=data.data;
                    var a = data.pages/5;
                    if(a<1){
                        $scope.habilitar=true;
                    }
                    else if ($scope.page+1<a){
                        $scope.page1=$scope.page+1;
                        $scope.habilitar=false;
                    }
                    else{
                        $scope.habilitar=true;
                    }
                    if(a==1){
                        $scope.habilitarmenos=true;
                        $scope.habilitar=true;
                    }
                    else if($scope.page>=1){
                        $scope.habilitarmenos=false;
                        $scope.page0=$scope.page-1;
                    }
                    else if($scope.page==0){
                        $scope.habilitarmenos=true;
                    }
                })
                .error(function (err) {
                    $timeout(function(){
                        swal("Error", err, "error");
                    })
                });
        }
    }
    $scope.ir=function(id){
        sessionStorage['conver']=JSON.stringify({_id: id});
        window.location.replace(base_url+'/chat');
    }
});