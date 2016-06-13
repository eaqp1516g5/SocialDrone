
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
    res.header("Access-Control-Allow-Headers", "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, x-access-token, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name, Authorization, userid");
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

var users=[];
var usuarios = [];

io.on('connection', function(conn){
    conn.emit('connection', "Connexion creada");
    conn.on('username', function(data, callback){
        if(data==null)
            callback(false);
        else{
            var exit = false;
            for (var i = 0; i < users.length; i++) {
                if (users[i].username == data) {
                    users[i].ws.push(conn);
                    for (var i = 0; i < users.length; i++) {
                        usuarios.push(users[i].username);
                    }
                    io.emit('listaUsers', usuarios);
                    callback(false);
                    exit= true;
                }
            }

            if(exit!=true) {
                callback(true);
                var user = {};
                user.username = data;
                user.ws = [];
                user.ws.push(conn);
                users.push(user);
                for (var i = 0; i < users.length; i++) {
                    usuarios.push(users[i].username);
                }
                io.emit('listaUsers', usuarios);
            }
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
        notification.find({userid: data, visto: false}).sort({date:-1}).exec(function(err, res){
            length = res.length;
        })
        notification.find({userid: data}).populate('userid').populate('actionuserid').sort({date:-1}).limit(5).exec(function(err, res){
            if(err) {}
            else if(res==[]){}
            else {
                for (var i = 0; i < users.length; i++) {
                    if (us == users[i].username) {
                            for (var j = 0; j < users[i].ws.length; j++) {
                                users[i].ws[j].emit('notification', {numeros: length, notifications: res});
                            }
                    }
                }
            }
        })
    })
    conn.on('comment', function(data){
        usuario.findOne({_id: data}).exec(function(err,res){
            if(err)conn.emit('err', "Error");
            else{
                for (var i=0; i< users.length;i++) {
                    if (res.username == users[i].username) {
                        for(var j=0; j < users[i].ws.length; j++) {
                            users[i].ws[j].emit('new notification', res);
                        }
                    }
                }
            }
        })
    })
    conn.on('follow', function(data){
        usuario.findOne({username: data}).exec(function(err,res){
            if(err)conn.emit('err', "Error");
            else{
                for(var i = 0; i < users.length; i++) {
                    if (res.username == users[i].username) {
                        for(var j=0; j<users[i].ws.length; j++)
                        users[i].ws[j].emit('new notification', res);
                    }
                }
            }
        })
    })
    conn.on('event', function(data){
        follow.findOne({userid: data}).populate('follower').exec(function(err,res){
            if(err){}
            else if (res!=undefined){
                for(var i= 0;i<res.follower.length;i++){
                    for(var j=0; j<users.length;j++) {
                        if (res.follower[i].username == users[j].username) {
                            for(var y=0; y<users[j].ws.length;y++) {
                                users[j].ws[y].emit('new notification', res);
                            }
                        }
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
                    for(var i=0; i<chatt.users.length; i++) {
                        var usuario = chatt.users[i];
                        if (usuario._id != data.userid) {
                            seen.findOneAndUpdate({user: usuario._id,
                                chat: data.chatid},{visto: false, date: new Date()}).exec(function(err,res){
                            })
                        }
                        else {
                            seen.findOneAndUpdate({user: usuario._id,
                                chat: data.chatid},{visto: true, date: new Date()}).exec(function(err,res){
                            })
                        }
                        for(var y = 0; y<users.length; y++) {
                            if (usuario.username == users[y].username) {
                                for(var j= 0; j<users[y].ws.length;j++){
                                users[y].ws[j].emit('newchatnotification', res);
                                users[y].ws[j].emit('chatmessage', res);
                                }
                            }
                        }
                    }
                });

            }})
    })
    conn.on('vistonotification', function(data){
        notification.findOneAndUpdate({userid: data.userid, idnotification: data.id},{visto: true}).exec(function (err, see) {
            if(err){}
            else if(see==undefined){}
            else{
                for(var i = 0; i<users.length;i++) {
                    if (see.userid.username == users[i].username) {
                        for (var j=0; j<users[i].ws.length; j++) {
                            users[i].ws[j].emit('newchatnotification', see);
                        }
                    }
                }
            }});
    });
    conn.on('visto', function(data){
        seen.findOneAndUpdate({user: data.userid, chat: data.chat},{visto: true}).exec(function (err, see) {
            if(err){}
            else if(see==undefined){}
            else{
                for(var i = 0; i<users.length;i++) {
                    if (see.user.username == users[i].username) {
                        for (var j=0; j<users[i].ws.length; j++) {
                            users[i].ws[j].emit('newchatnotification', see);
                        }
                    }
                }
            }});
    });
    conn.on('chatnotification', function(data){
        var novisto=0;
        var datos=new Array();
        seen.find({user: data, visto: false}).exec(function(err,visto){
            if (err){}
            else{
                novisto=visto.length;
                seen.find({user: data}).sort({date: -1}).limit(5).exec(function(err,chatt){
                    if(err){}
                    else{
                        conn.emit('chatnotification', {data: chatt, visto: novisto});
                    }
                });
            }
        })
    })
    conn.on('disconnect', function(data){
        for (var i = 0; i < users.length; i++) {
            for (var a = 0; a < users[i].ws.length; a++) {

                if (users[i].ws[a] == conn) {
                    users[i].ws.splice(a, 1);
                    if (users[i].ws == "") {
                        users.splice(i, 1);

                    }
                    break;
                }
            }
        }
        io.emit('listaNicks', usuarios);
    })
});
http2.listen(3000);