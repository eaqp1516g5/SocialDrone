/**
 * Created by Kenshin on 22/03/16.
 */


module.exports = function (app) {

    var drone = require('../models/drone.js');
    var drones = [];
    fs = require('fs');
    var __dirname = '/var/www/html/public/images/drones';
    var URL = 'http://147.83.7.159/images/drones/';

    addDrone = function (req, res) {
        console.log(req.files.file.path);
        console.log(req.files.imageUrl);
        var resultado = res;
        if (!req.body.vendor || !req.body.model|| !req.body.description) {
        console.log("ENTRA2");
	 res.status(400).send('You must fill all the fields');
        }
        else {
            if (req.files.file.path != undefined) {
                fs.readFile(req.files.file.path, function (err, data) {
                    var random = Math.floor(Math.random() * 3810830183000908770);
                    var imageName =random + '.png';
                    var path = __dirname + '/' + random+'.png';
                    fs.writeFile(path, data, function (err) {
                                var newDrone = new drone({
                                    vendor: req.body.vendor,
                                    model: req.body.model,
                                    description: req.body.description,
                                    imageUrl: URL + imageName
                                });

                                newDrone.save(function (err) {
                                    if (err) res.status(500).send('Internal server error');
                                   else
                                    res.status(200).json(newDrone);
                                });
                    });

                });
            }
            else {
                modelito = req.body.model;
                drone.find({model: modelito}, function (err, user) {
                    if (user.length != 0) {
                        resultado.status(409).send('El Dron ya se encuentra en nuestra base de datos');
                    }

                    else {
                        var dr = new drone({
                            vendor: req.body.vendor,
                            model: req.body.model,
                            description: req.body.description,
                            imageUrl: req.body.imageUrl
                        });
                        dr.save(function (err) {
                            if (err) res.status(500).send('Internal server error');
                            else res.status(200).json(dr);

                        })
                    }
                });

            }
        }


    };


    //hacemos un GET de los drones a la db de mongo
    getDrones = function (req, res) {
//        try {
            var resultado = res;
            drone.find({}, function (err, drones) {
                if(err)
                {
                    return res.send(500, err.message);
                }
                else if (drones == undefined)
                    res.send(500, "No Drones on the DB");
                else
                    res.status(200).json(drones); // returns all drones in JSON format

            })
    };

    //Eliminar drone por ID
    deleteDrone = function (req, res) {
        var resultado = res;
        drone.find({"model": req.params.model}, function (err, drones) {
            if (drones == undefined) {
                resultado.status(404).send('Drone no encontrado');
            }

            else {
                drone.remove({"model": req.params.model},
                    function (err) {
                        if (err) {
                            res.send(err);
                        }
                        else {
                            res.status(200).send("Drone borrado correctamente");
                        }
                    });
            }
        });
    };

    app.post('/drones', addDrone);
    app.get('/drones', getDrones);
    app.delete('/drones/:model', deleteDrone);
}
