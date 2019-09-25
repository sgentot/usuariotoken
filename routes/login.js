var express = require('express');
//var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var app = express();

var Usuario = require('../models/usuario');

var SEED = require('../config/config').SEED;




app.post('/', (req, res, next) => {

    var body = req.body;

    var usuarioDB = Usuario.findOne({ "email": body.email });

    Usuario.findOne({ "email": body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciale incorrectas - email',
                errors: err
            });
        }

        if (body.password !== usuarioDB.password) {

            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciale incorrectas - password',
                errors: err
            });

        }

        //Crear un token 

        var token = jwt.sign({
                usuario: usuarioDB
            }, SEED, {
                expiresIn: 14400
            }) //4 horas 

        res.status(201).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id

        });

    });


});

module.exports = app;