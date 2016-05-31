
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
var http2       = require('http').Server(app);
var fs          = require('fs');
var io          = require('socket.io')(http2);
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
routes = require('./routes/notifications')(app);
routes = require('./routes/event')(app);
routes = require('./routes/follower')(app);
routes = require('./routes/chat')(app);

app.get('*', function (req, res) {
    res.sendfile('./public/index.html');
});

//Creamos e iniciamos el servidor
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
var notification = require('./models/notification.js');
var usuario = require('./models/user.js');
var follow = require('./models/follow.js');
var chat = require('./models/chat.js');
var chatmessage = require('./models/chatMessage.js');
var seen = require('./models/isseen.js');

var users={};

io.on('connection', function(conn){
    conn.emit('connection', "Connexion creada");
    conn.on('username', function(data, callback){
        if(data in users){
            callback(false);
        }else if(data==null)
            callback(false);
        else{
            callback(true);
            conn.username=data;
            users[conn.username]=conn;
            io.emit('listaNicks', Object.keys(users));
        }

    })
    conn.on('notification', function(data){
        var length
        var us
        usuario.findOne({_id: data}).exec(function(err,res){
            if(err){}
            else if (res==undefined){}
            else us=res.username;
        });
        notification.find({userid: data}).sort({date:-1}).exec(function(err, res){
            length = res.length;
        })
        notification.find({userid: data}).populate('userid').populate('actionuserid').sort({date:-1}).limit(5).exec(function(err, res){
            if(err) {}
            else if(res==[]){}
            else {
                if(us in users)
                users[us].emit('notification', {numeros: length, notifications: res});}
        })
    })
    conn.on('comment', function(data){
        usuario.findOne({_id: data}).exec(function(err,res){
            if(err)conn.emit('err', "Error");
            else{
                if(res.username in users) {
                    users[res.username].emit('new notification', res);
                }
            }
        })
    })
    conn.on('follow', function(data){
        usuario.findOne({username: data}).exec(function(err,res){
            if(err)conn.emit('err', "Error");
            else{
                if(res.username in users) {
                    users[res.username].emit('new notification', res);
                }
            }
        })
    })
    conn.on('event', function(data){
        follow.findOne({userid: data}).populate('follower').exec(function(err,res){
            if(err){}
            else if (res!=undefined){
                for(var i= 0;i<res.follower.length;i++){
                    if(res.follower[i].username in users) {
                        users[res.follower[i].username].emit('new notification', res);
                    }
                }
            }
        })
    })
    conn.on('chatmessage', function(data){
        var newmessage = new chatmessage({
           user: data.userid,
            message: data.text,
            chatid: data.chatid
        });
        newmessage.save(function(err){
            if (err){}
        })
        chat.findOne({_id:data.chatid}).populate('users').exec(function(err,chatt){
            if(err){}
            else {
                        chatmessage.findOne({_id:newmessage._id}).populate('user').populate('chatid').exec(function(err,res){
                            for(var i=0; i<chatt.users.length; i++){
                                var usuario = chatt.users[i];
                                if(usuario._id!=data.userid) {
                                    seen.findOne({user: usuario._id, chat: data.chatid}).populate('user').exec(function (err, see) {
                                        if(err){}
                                        else if(see==undefined){}
                                        else{
                                            see.update({visto: false}, function(err){
                                                if(err){}
                                            });
                                            if (usuario.username in users) {
                                                users[usuario.username].emit('chatnotification', see);
                                            }
                                        }
                                    });
                                }
                                if (usuario.username in users) {
                                    users[usuario.username].emit('chatmessage', res);
                                }
                            }

                        })
                }
        })
    });
    conn.on('visto', function(data){
        seen.findOne({user: data.userid, chat: data.chatid}).populate('user').exec(function (err, see) {
            if(err){}
            else if(see==undefined){}
            else{
                see.update({visto: true}, function(err){
                    if(err){}
                });
                if (see.user.username in users) {
                    users[see.user.username].emit('chatnotification', see);
                }
            }
        });
    });
    conn.on('disconnect', function(data){
        if(!conn.username) return;
        delete users[conn.username];
        io.emit('listaNicks', Object.keys(users));
    })
});
http2.listen(3000);