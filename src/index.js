const express = require("express");
const exphbs = require('express-handlebars');
const cheerio = require("cheerio");
const request = require("request-promise");

require("dotenv").config();
require("./dbconnection");

const app = express();

const Equipo = require("./models/equipoModels");
const helpers = require('./helpers');
const cron = require("node-cron");
const path = require("path");

// Configurar handlebars y registrar los helpers
app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", exphbs.engine({
  helpers: helpers }));

app.set("view engine", "handlebars")

app.get("/", async (req, res) => {
  try {
    const equipo = await Equipo.find().sort({ posicion: +1 }).lean();
    res.render("tabla", { equipo: equipo });
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    res.status(500).send("Error interno del servidor");
  }
});


async function inicio() {
  try {
        const $ = await request({
        uri: "https://www.futbolargentino.com/primera-division/tabla-de-posiciones",
        transform: (body) => cheerio.load(body) });

        const nuevoEquipo = [];

      $("tr").each((i, el) => {
        const posicion = parseInt($(el).find("td.bg-color:eq(0)").text());
        const img = $(el).find("td.equipo img").attr("data-src");
        const equipo = $(el).find(".d-none.d-md-inline").text();
        const pjs = parseInt($(el).find("td.bg-color:eq(1)").text());
        const ganados = parseInt($(el).find("td.d-none.d-md-table-cell:eq(0)").text());
        const empatados = parseInt($(el).find("td.d-none.d-md-table-cell:eq(1)").text());
        const perdidos = parseInt($(el).find("td.d-none.d-md-table-cell:eq(2)").text());
        const gf = parseInt($(el).find("td.d-none.d-md-table-cell:eq(3)").text());
        const gc = parseInt($(el).find("td.d-none.d-md-table-cell:eq(4)").text());
        const dg = parseInt($(el).find("td:eq(8)").text().trim());
        const puntos = parseInt($(el).find("td.bg-color:eq(2)").text());

        // Verificar si alguno de los valores es NaN
        if (isNaN(posicion) || isNaN(pjs) || isNaN(ganados) || isNaN(empatados) || isNaN(perdidos) || isNaN(gf) || isNaN(gc) || isNaN(dg) || isNaN(puntos)) {
          console.warn("Se encontró un valor NaN, omitiendo el registro");
          return;
        }
         nuevoEquipo.push({posicion, img, equipo, pjs, ganados, empatados, perdidos, gf, gc, dg, puntos });
      
      });

    if (process.env.CRON_ACTION === 'delete') {
      await Equipo.deleteMany({});
      await Equipo.insertMany(nuevoEquipo);
    
    } else if (process.env.CRON_ACTION === 'update') {
      await Equipo.updateMany({}, nuevoEquipo);
    
    } else {
      console.log("Acción de cron no válida");}

  } catch (error) {
    console.error("Error:", error);
  }
}

const cronAction = process.env.CRON_ACTION || 'delete';
const cronTime = process.env.CRON_TIME || '*/1 * * * *';

cron.schedule(cronTime, async () => {
  try {
    if (cronAction === 'update') {
      await inicio();
      console.log("Actualización de la tabla completada exitosamente");
    } else if (cronAction === 'delete') {
      console.log("Tabla borrada exitosamente");
      await inicio();
    } else {
      console.log("Acción de cron no válida");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});



const port = process.env.PORT || 3005;
app.listen(port);
console.log("puerto", port);