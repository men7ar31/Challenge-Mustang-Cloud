const cheerio = require("cheerio");
const request = require("request-promise");
const express = require("express");
const mongoose = require("mongoose");
const Tabla = require("./models/tablaModels");
const cron = require("node-cron");

const app = express();

require('./dbconnection');

const url = 'https://www.futbolargentino.com/primera-division/tabla-de-posiciones';



cron.schedule('*/5 * * * * *', () => {
    request(url, (error, response, html) => {
      if (!error && response.statusCode === 200) {
        const $ = cheerio.load(html);
        const rows = $('table tbody tr');
  
        const data = [];
        rows.each((index, row) => {
          const columns = $(row).find('td');
          const team = $(columns[1]).text().trim();
          const pj = parseInt($(columns[2]).text().trim(), 10);
          const g = parseInt($(columns[3]).text().trim(), 10);
          const e = parseInt($(columns[4]).text().trim(), 10);
          const p = parseInt($(columns[5]).text().trim(), 10);
          const f = parseInt($(columns[6]).text().trim(), 10);
          const c = parseInt($(columns[7]).text().trim(), 10);
          const pts = parseInt($(columns[8]).text().trim(), 10);
  
          data.push({ team, pj, g, e, p, f, c, pts });
        });
        Tabla.deleteMany({}, { maxTimeMS: 30000 })
        .then(() => {
        // Operación de eliminación exitosa
        // Realizar la operación de creación
        return Tabla.save({data});
        })
        .then((result) => {
            console.log('Creación exitosa:', result);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
            
      } else {
        console.error(error);
      }
    });
  });


  app.listen(3005)
console.log('puerto 3005')