const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;

async function connectarBd() {
    try {
        console.log("Iniciando conexión a MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI,{
            serverSelectionTimeoutMS: 5000,
            family: 4,
        });
        console.log("Conectado a MongoDB");

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
        });
    }
    catch(error) {
        console.log("Error en conexión a MongoDB: ", error);
    
    }
}

const usuarioEsquema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    clave: { type: String, required: true }
});

const Usuario = mongoose.model("Usuario", usuarioEsquema);

app.post("/api/login", async (req, res) => {
    const { email, clave } = req.body;
    try {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        if (usuario.clave !== clave) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }
        
        const { clave: _, ...usuarioSinClave } = usuario.toObject();
        res.json(usuarioSinClave);
    }
    catch(error) {
        console.log("Error al hacer login", error);
        res.status(500).json({ message: "Error del servidor" });
    }
});

connectarBd();