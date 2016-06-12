/**
 * Created by Kenshin on 22/05/16.
 */


module.exports = function (app) {

    var stream = require('../models/stream.js');
    var streams = [];

    function  addStream (req, res) {
        var resultado = res;

        modelito = req.body.model;
        stream.find({model: modelito}, function (err, user) {
            if (user.length != 0) {
                resultado.status(409).send('El Streaming ya se encuentra en nuestra base de datos');
            }

            else {

                if (req.streamIP== current) {
                    var Ipsita = getClientIp(req);
                    var dr = new stream({
                        username: req.body.username,
                        drone: req.drone,
                        ip: Ipsita,
                        pilots: undefined
                    });
                }
                else {
                    var dr = new stream({
                        username: req.body.username,
                        drone: req.drone,
                        ip: req.body.ip,
                        pilots: undefined

                    });
                }
                dr.save(function (err) {
                    if (err) res.status(500).send('Internal server error');
                    else res.status(200).json(dr);

                })
            }
        });

    };




    function getClientIp(req) {
        var ipAddress;
        // The request may be forwarded from local web server.
        var forwardedIpsStr = req.header('x-forwarded-for');
        if (forwardedIpsStr) {
            // 'x-forwarded-for' header may return multiple IP addresses in
            // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
            // the first one
            var forwardedIps = forwardedIpsStr.split(',');
            ipAddress = forwardedIps[0];
        }
        if (!ipAddress) {
            // If request was not forwarded
            ipAddress = req.connection.remoteAddress;
        }
        return ipAddress;
    };

    function getStream (req, res) {
//        try {
        var resultado = res;
        stream.find({}, function (err, streams) {
            if(err)
            {
                return res.send(500, err.message);
            }
            else if (streams == undefined)
                res.send(500, "No Streams on the DB");
            else
                res.status(200).json(streams); // returns all drones in JSON format

        })
    };

//Eliminar drone por ID
    function deleteFlight (req, res) {
        var resultado = res;
        stream.find({"_id": req.params._id}, function (err, streams) {
            if (streams == undefined) {
                resultado.status(404).send('Streaming no encontrado');
            }

            else {
                stream.remove({"model": req.params.model},
                    function (err) {
                        if (err) {
                            res.send(err);
                        }
                        else {
                            res.status(200).send("Streaming borrado correctamente");
                        }
                    });
            }
        });
    };

    app.post('/stream', addStream);
    app.get('/stream', getStream);
    app.delete('/stream/:id', deleteFlight);
}
