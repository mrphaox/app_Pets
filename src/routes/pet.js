const express = require('express');
const Pet = require('../models/pet'); // Asegúrate de que el nombre del archivo esté correcto
const { autenticarToken } = require('../middleware/auth');
const { validarDueños } = require('../middleware/validateOwners');

const petRoutes = express.Router();

// Crear una nueva mascota
petRoutes.post("/pets/create", autenticarToken, validarDueños, async(req, res) => {
    try {
        const { name, type, sex, breed, birthdate, age, weight, height, temperament, chipNumber, description, owners } = req.body;
        const nuevaMascota = new Pet({ name, type, sex, breed, birthdate, age, weight, height, temperament, chipNumber, description, owners });
        const mascotaGuardada = await nuevaMascota.save();
        res.status(201).json(mascotaGuardada);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// Obtener todas las mascotas
petRoutes.get("/pets/list", async(req, res) => {
    try {
        const mascotas = await Pet.find().populate('owners', 'nombre email _id');
        res.status(200).json(mascotas);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// Obtener una mascota por ID
petRoutes.get('/pets/:id/view', async(req, res) => {
    try {
        const mascota = await Pet.findById(req.params.id).populate('owners', 'nombre email _id');
        if (!mascota) return res.status(404).json({ mensaje: 'Mascota no encontrada' });
        res.status(200).json(mascota);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// Actualizar la información de una mascota
petRoutes.put('/pets/:id/update', validarDueños, async(req, res) => {
    try {
        const {
            name,
            type,
            sex,
            breed,
            birthdate,
            age,
            weight,
            height,
            temperament,
            chipNumber,
            description,
            owners
        } = req.body;

        const mascotaActualizada = await Pet.findByIdAndUpdate(
            req.params.id, {
                name,
                type,
                sex,
                breed,
                birthdate,
                age,
                weight,
                height,
                temperament,
                chipNumber,
                description,
                owners
            }, { new: true }
        ).populate('owners', 'nombre email _id');

        if (!mascotaActualizada) return res.status(404).json({ mensaje: 'Mascota no encontrada' });

        res.status(200).json(mascotaActualizada);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// Eliminar una mascota
petRoutes.delete('/pets/:id/delete', async(req, res) => {
    try {
        const mascotaEliminada = await Pet.findByIdAndDelete(req.params.id);
        if (!mascotaEliminada) return res.status(404).json({ mensaje: 'Mascota no encontrada' });
        res.status(200).json({ mensaje: 'Mascota eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

module.exports = petRoutes;