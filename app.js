
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
var methodOverride = require('method-override');
var bodyParser      = require("body-parser");
var cookieParser = require('cookie-parser');
var passport = require('passport');
var router = express.Router();
var expressSession = require('express-session');
var jwt    = require('jsonwebtoken');
var formidable = require('formidable');
var bcrypt = require ('bcrypt-nodejs');
// Conexión con la base de datos
mongoose.connect("mongodb://localhost/SocialDroneDB", function (err, res) {
    if (err) {
        console.log(err);
    } else {
        console.log("Conectado a la base de datos");
    }
});

// Configuración


app.set('port',process.env.PORT || 8080); //Ponemos a escuchar en el puerto 8000
app.use(express.bodyParser());
app.use(express.json());


app.use(express.static(path.join(__dirname, 'public'))); //Localización de los ficheros estáticos
app.use(express.logger('dev')); //Muestra log de los request

app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.cookieParser());


//filtro cors de los cojones
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, x-access-token, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name, Authorization");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

//Rutas API
routes = require('./routes/users')(app);
routes = require('./routes/messages')(app);
routes = require('./routes/comment')(app);
routes = require('./routes/drones')(app);
routes = require('./routes/login')(app);
routes = require('./routes/event')(app);



app.get('*', function (req, res) {
    res.sendfile('./public/index.html');
});

//Creamos e iniciamos el servidor
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
