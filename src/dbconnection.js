const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.BD_URL, {
    useNewUrlParser: false, // Eliminar esta opción
    useUnifiedTopology: true, // Otras opciones de conexión
    // ... Otras opciones de conexión
  })
  .then(() => {
    console.log('Conexión exitosa a MongoDB');
  })
  .catch((err) => {
    console.error('Error en la conexión a MongoDB:', err);
  });


  