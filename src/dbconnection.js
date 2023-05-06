const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/tabla-de-posiciones', {
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


  