const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.BD_URL, {
    useNewUrlParser: false, 
    useUnifiedTopology: true, 
    
  })
  .then(() => {
    console.log('Conexión exitosa a MongoDB');
  })
  .catch((err) => {
    console.error('Error en la conexión a MongoDB:', err);
  });


  