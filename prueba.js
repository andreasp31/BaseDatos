const mongoose = require('mongoose');

// PEGA AQUÍ TU RUTA NUEVA
const uri="mongodb+srv://admin_proyecto:PetConnect2026@cluster0.5vapmej.mongodb.net/?appName=Cluster0";

console.log("Intentando conectar...");

mongoose.connect(uri)
  .then(() => {
    console.log("¡POR FIN! ✅ Conexión establecida con éxito.");
    process.exit(0); 
  })
  .catch(err => {
    console.log("❌ ERROR DEFINITIVO:");
    console.error(err.message);
    process.exit(1);
  });