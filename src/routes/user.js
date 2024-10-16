// Importar las dependencias necesarias
const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { autenticarToken } = require("../middleware/auth"); // Asegúrate de que esté definido una sola vez

const Router = express.Router();

// Registro de usuario
Router.post('/users/register', async (req, res) => {
  try {
    const { nombre, email, contraseña } = req.body;
    const salt = await bcrypt.genSalt(10);
    const contraseñaHash = await bcrypt.hash(contraseña, salt);

    const nuevoUsuario = new User({ nombre, email, contraseña: contraseñaHash });
    const usuarioGuardado = await nuevoUsuario.save();
    res.status(201).json(usuarioGuardado);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
});

// Inicio de sesión
Router.post('/login', async (req, res) => {
  try {
    const { email, contraseña } = req.body;
    const usuario = await User.findOne({ email });
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida) return res.status(400).json({ mensaje: 'Contraseña incorrecta' });

    const token = jwt.sign({ _id: usuario._id, email: usuario.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

// Actualizar un usuario
Router.put('/users/:id/update', autenticarToken, async (req, res) => {
  try {
    const { nombre, email } = req.body;
    const usuarioActualizado = await User.findByIdAndUpdate(req.params.id, { nombre, email }, { new: true });
    if (!usuarioActualizado) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.status(200).json(usuarioActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
});

// Obtener todos los usuarios
Router.get("/users/list", (req, res) => {
  User.find()
    .then((data) => res.json(data))
    .catch((error) => res.status(500).json({ mensaje: error.message }));
});

// Eliminar un usuario
Router.delete('/users/:id/delete', autenticarToken, async (req, res) => {
  try {
    const usuarioEliminado = await User.findByIdAndDelete(req.params.id);
    if (!usuarioEliminado) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.status(200).json({ mensaje: 'Usuario eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

// Obtener usuario por ID
Router.get("/users/:id/view", autenticarToken, async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

module.exports = Router;