// Importar dependencias
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require('cors');

require("dotenv").config(); // dotenv para crear variables de ambiente para token db

// Modelos de rutas
const userRoutes = require("./routes/user");
const petRoutes = require("./routes/pet");

// Crear aplicación
const app = express();
const port = process.env.PORT || 9000;

// Middleware y configuración de rutas
app.use(express.json());  // Middleware para parsear JSON
app.use(cors());  // Habilitar CORS para todas las solicitudes
app.use('/api', userRoutes); // Ruta para los endpoints relacionados con usuarios
app.use('/api', petRoutes);  // Ruta para los endpoints relacionados con mascotas

// Conexión a MongoDB
mongoose
.connect(process.env.MONGODB_URI)
.then(() => console.log("Conectado a MongoDB Atlas"))
.catch((error) => console.error("Error al conectar a MongoDB Atlas:", error));

// Iniciar servidor
app.listen(port, () => console.log('Servidor escuchando en el puerto', port));
