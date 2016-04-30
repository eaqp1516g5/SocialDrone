/**
 * Created by bernat on 18/04/16.
 */


angular.module('SocialDrone').controller('LoginCtrl',['$http', '$scope', '$window','$rootScope', function ($http, $scope, $window, $rootScope) {
    $scope.newUser={};
    $scope.usuar={};
    $scope.users={};
    $scope.loginUser={};
    $scope.registrar={};
    $scope.currentUser={};
    $scope.currentUserSocial={};
    var base_url = "http://localhost:8080";
    function volver() {
        window.location=base_url;
    }
    $scope.file_changed = function (element) {
        $scope.$apply(function (scope) {
            var photofile = element.files[0];
            console.log(photofile);
            var reader = new FileReader();
            reader.onload = function (e) {
                foto = e.target.result;
            };
            reader.readAsDataURL(photofile);
        });
    };
    $scope.loginFacebook=function (err) {
       //window.location='http://localhost:8080/auth/facebook';
        if(err)
            console.log('Error');
        else {
            $http.get(base_url + '/profile')
                .success(function (data) {
                    sessionStorage["userSocial"]=JSON.stringify(data);
                    console.log(data);
                })
                .error(function (err) {
                });
        }
    };
    getUser();
    function getUser() {
        if(sessionStorage["user"]!=undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            console.log(usuario);
            $http.get(base_url + '/users/' + usuario.userid, {headers: {'x-access-token': usuario.token}})
                .success(function (data) {
                    $scope.currentUser = data;
                    console.log(data);
                    sessionStorage["userInfo"] = data;
                })
                .error(function (err) {
                    console.log('Login Social');
                    $http.get(base_url + '/usersS/' + usuario.idFB, {headers: {'x-access-token': usuario.token}})
                        .success(function (data) {
                            $scope.currentUser = data;
                            sessionStorage["userInfo"] = data;
                            console.log($scope.currentUser);
                        })
                        .error(function (err) {
                            console.log('ERROR');
                        });
                });
        }
    }

    $http.get(base_url+'/users').success(function(data) {
        $scope.users = data;
        console.log("Obtengo users");
        console.log( $scope.users);
    });
    var _selected;
    $scope.selected = undefined;
    $scope.onSelect = function ($item, $model, $label) {
        window.location.href = "/user/" + $model.username;
        $scope.$item = $item;
        $scope.$model = $model;
        $scope.$label = $label;
        $scope.userSelected = $model.username;

    };
    $scope.modelOptions = {
        debounce: {
            default: 500,
            blur: 250
        },
        getterSetter: true
    };
    $scope.registrarUser= function () {
        var UsarioLocalNuevo = new FormData();
        UsarioLocalNuevo.append('username',$scope.newUser.username);
        UsarioLocalNuevo.append('password',$scope.newUser.password);
        UsarioLocalNuevo.append('name',$scope.newUser.name);
        UsarioLocalNuevo.append('lastname',$scope.newUser.lastname);
        UsarioLocalNuevo.append('mail',$scope.newUser.mail);
        UsarioLocalNuevo.append('imageUrl',$('#imgInp')[0].files[0]);
        console.log(UsarioLocalNuevo);
        if ($scope.newUser.username!=undefined && $scope.newUser.password!=undefined && $scope.newUser.name!=undefined && $scope.newUser.lastname!=undefined && $scope.newUser.mail!=undefined){
        $http.post(base_url+'/users',UsarioLocalNuevo, {
                transformRequest: angular.identity,
                    headers: {
                    'Content-Type': undefined
                }
           /* username: $scope.newUser.username,
            password: $scope.newUser.password,
            name: $scope.newUser.name,
            lastname: $scope.newUser.lastname,
            mail: $scope.newUser.mail*/
        }).success(function (data) {
                $scope.newUser.username=null;
                $scope.newUser.password=null;
                $scope.newUser.name=null;
                $scope.newUser.lastname=null;
                $scope.newUser.mail=null;
                $scope.Regist(true);
            })
            .error(function (error, status, headers, config) {
                console.log(error);
                swal({   title: "Error!",   text: error,   type: "error",   confirmButtonText: "Cool" });
                $scope.newUser.username=null;
            });
        }
    };
    $scope.loginUser= function () {
        if ($scope.loginUser.username!=undefined && $scope.loginUser.password!=undefined){
            console.log('1111111111111111');
            $http.post(base_url+'/authenticate',{
                username: $scope.loginUser.username,
                password: $scope.loginUser.password
            }).success(function (data) {
                console.log('222222222222222222');
                console.log(data.success);
                
                if(data.success==false){
                    console.log('Entro falso');
                    console.log('No logn correcto '+data.success);
                    $scope.loginUser.username=null;
                    $scope.loginUser.password=null;
                    swal({   title: "Error!",   text: data.message,   type: "error",   confirmButtonText: "Cool" });
                }
                else{
                    console.log(data);
                    $scope.loginUser.username=null;
                    $scope.loginUser.password=null;
                    sessionStorage["user"]=JSON.stringify(data);
                    volver();
                }
                }).error(function (error, status, headers, config) {
                    console.log(error);
                });
        }
    };
    $scope.Regist=function (re) {
        $scope.registrar=re;
    };

   $scope.logout=function (userid) {
       if (sessionStorage["user"]!=undefined) {
           $scope.usuar = JSON.parse(sessionStorage["user"]);
           console.log($scope.usuar._id);
           console.log('LOGOUT!!!!!!!!!!!!!!!!!!!!!!!');
           console.log(userid);
           console.log('TOKEN!!!!!!!!!!!!!!!!!!!!!!!');
           console.log($scope.usuar.token);
           $http.delete(base_url+'/authenticate/'+$scope.usuar._id, {headers: {'x-access-token': $scope.usuar.token}

           }).success(function () {
               sessionStorage.removeItem("user");
               $scope.usuar=null;
               window.location=base_url;
           }).error(function (err) {
               console.log(err);
           })
       }
   }
}]);