const mongoose = require('mongoose')

const tablaSchemas = mongoose.Schema({
    posicion: Number,
    img: String,
    equipo: String,
    pjs: Number,
    ganados: Number,
    empatados: Number,
    perdidos:Number,
    gf: Number,
    gc: Number,
    dg: String,
    puntos: Number
})

module.exports = mongoose.model('Tabla', tablaSchemas)