/**
 * Created by bernat on 10/03/16.
 */
//Configuración del servidor y las rutas

//Librerías que necesitamos
var express     = require('express');
var app         = express();
var mongoose    = require('mongoose');
var path        = require('path');
var http        = require('http');
var fs          = require('fs');
var bodyParser      = require("body-parser");
var cookieParser = require('cookie-parser');
var passport = require('passport');

// Conexión con la base de datos
mongoose.connect("mongodb://localhost/SocialDroneDB", function (err, res) {
    if (err) {
        console.log(err);
    } else {
        console.log("Conectado a la base de datos");
    }
});

// Configuración

app.set('port',process.env.PORT || 3000); //Ponemos a escuchar en el puerto 3000
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public'))); //Localización de los ficheros estáticos
app.use(express.logger('dev')); //Muestra log de los request
app.use(passport.initialize());
app.use(passport.session());

//Rutas API
routes = require('./routes/users')(app);

//Creamos e iniciamos el servidor
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});