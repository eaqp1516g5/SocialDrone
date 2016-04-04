/**
 * Created by Kenshin on 22/03/16.
 */


module.exports = function (app) {

    var drone = require('../models/drone.js');
    var drones = [];

    addDrone = function (req, res) {
         console.log("ENTRA1");
        var resultado = res;
        if (!req.body.vendor || !req.body.model || !req.body.weight || !req.body.battery || !req.body.description || !req.body.imageUrl) {
        console.log("ENTRA2");
	 res.status(400).send('You must fill all the fields');
        }
        else {
		console.log("ENTRA3");
            modelito = req.body.model;
            drone.find({model: modelito}, function (err, user) {
                if (user.length != 0) {
                    resultado.status(409).send('El Dron ya se encuentra en nuestra base de datos');
                }

                else {
        	console.log("ENTRA4");
	    if (!req.body.type) {
                        var dr = new drone({
                            vendor: req.body.vendor,
                            model: req.body.model,
                            weight: req.body.weight,
                            battery: req.body.battery,
                            description: req.body.description,
                            type: req.body.type,
                            imageUrl: req.body.imageUrl,
                            releaseDate: req.body.date
                        });
                    }
                    else {
console.log("NOSEYADONDE ENTRA");
                        var dr = new drone({
                            vendor: req.body.vendor,
                            model: req.body.model,
                            weight: req.body.weight,
                            battery: req.body.battery,
                            description: req.body.description,
                            type: 'commercial',
                            imageUrl: req.body.imageUrl,
                            releaseDate: req.body.date
                        });
                    }
console.log("yabadabadooooh");
                    console.log(dr);
                    dr.save(function (err) {
                        if (err) res.status(500).send('Internal server error');
                        else res.status(200).json(dr);

                    })
                }
            });

        }


    };


    //hacemos un GET de los drones a la db de mongo
    getDrones = function (req, res) {
//        try {
            var resultado = res;
            drone.find({}, {vendor: 1, model: 1, weight: 1, battery: 1, description: 1, type: 1, imageUrl: 1, releaseDate: 1}, function (err, drones) {
                if(err)
                {
                    return res.send(500, err.message);
                }
                else if (drones == undefined)
                        return res.send(500, "No Drones on the DB");
                else
                        return res.status(200).json(drones); // returns all drones in JSON format

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
    app.delete('/drones/by/:model', deleteDrone);
}
