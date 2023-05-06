const express = require("express");
const cheerio = require("cheerio");
const exphbs  = require('express-handlebars');
const request = require("request-promise");

const Tabla = require("./models/tablaModels");
const cron = require("node-cron");
const path = require('path');

require('./dbconnection');
const app = express();
const ejs = require('ejs');

app.set("views", path.join(__dirname, "views"));

app.set('view engine', 'ejs');

app.get("/tablas", async (req, res) => {
  try {

    const tabla = await Tabla.find().sort({posicion: +1})
    res.render('tabla', {tabla: tabla});
  } catch (error) {

    console.error('Error al obtener los datos:', error);
    res.status(500).send('Error interno del servidor');
  
  }
  
})

async function inicio() {
  const $ = await request({
    uri: "https://www.futbolargentino.com/primera-division/tabla-de-posiciones",
    transform: (body) => cheerio.load(body)
  });
  
  $("tr").each((i, el) => {
    const posicion = parseInt($(el).find("td.bg-color:eq(0)").text());
    const img = $(el).find("td.equipo img").attr('data-src');
    const equipo = $(el).find(".d-none.d-md-inline").text();
    const pjs = parseInt($(el).find("td.bg-color:eq(1)").text());
    const ganados = parseInt($(el).find("td.d-none.d-md-table-cell:eq(0)").text());
    const empatados = parseInt($(el).find("td.d-none.d-md-table-cell:eq(1)").text());
    const perdidos = parseInt($(el).find("td.d-none.d-md-table-cell:eq(2)").text());
    const gf = parseInt($(el).find("td.d-none.d-md-table-cell:eq(3)").text());
    const gc = parseInt($(el).find("td.d-none.d-md-table-cell:eq(4)").text());
    const dg = parseInt($(el).find("td:eq(8)").text().trim());
    const puntos = parseInt($(el).find("td.bg-color:eq(2)").text());
        Tabla.create({
          posicion: posicion,
          img: img,
          equipo: equipo,
          pjs: pjs,
          ganados: ganados,
          empatados: empatados,
          perdidos: perdidos,
          gf: gf,
          gc: gc,
          dg: dg,
          puntos: puntos})
      .then((result) => {
        //console.log('Creación exitosa:', result);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
});
      

}
cron.schedule("*/5 * * * *", () => {
  Tabla.deleteMany({})
  .then(() => {
    console.log('Tabla borrada exitosamente');
    // Aquí puedes realizar las operaciones para guardar los nuevos datos obtenidos
  })
  .catch((error) => {
    console.error('Error al borrar tabla:', error);
  });
  inicio();
});

app.listen(3005)
console.log('puerto 3005')