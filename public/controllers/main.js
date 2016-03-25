/**
 * Created by bernat on 24/03/16.
 */
angular.module('SocialDrone',[]);

function mainController($scope, $http) {
    $scope.newUser = {};
    $scope.users = {};
    $scope.selected = false;

    // Obtenemos todos los datos de la base de datos
    $http.get('/users').success(function(data) {
            $scope.users = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // Función para registrar a una persona
    $scope.registrarPersona = function() {
        $http.post('/users', $scope.newUser)
            .success(function(data) {
                $scope.newUser = {}; // Borramos los datos del formulario
                $scope.users = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // Función para editar los datos de una persona
    $scope.modificarPersona = function(newPersona) {
        $http.put('/users/' + $scope.newUser.username)
            .success(function(data) {
                $scope.newUser = {}; // Borramos los datos del formulario
                $scope.users = data;
                $scope.selected = false;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // Función que borra un objeto persona conocido su id
    $scope.borrarPersona = function(newPersona) {
        $http.delete('/users/' + $scope.newUser._id)
            .success(function(data) {
                $scope.newUser = {};
                $scope.users = data;
                $scope.selected = false;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // Función para coger el objeto seleccionado en la tabla
    $scope.selectPerson = function(persona) {
        $scope.newUser = persona;
        $scope.selected = true;
        console.log($scope.newUser, $scope.selected);
    };
}