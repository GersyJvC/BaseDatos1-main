const express = require('express');
const router = express.Router();
const { Persona } = require('../models');

// Obtener todos
router.get('/', async (req, res) => {
  try {
    const personas = await Persona.findAll();
    res.json(personas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener por ID
router.get('/:id', async (req, res) => {
  try {
    const persona = await Persona.findByPk(req.params.id);
    if (persona) {
      res.json(persona);
    } else {
      res.status(404).json({ message: 'Persona no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener por nombre (como filtro)
router.get('/buscar/nombre/:nombre', async (req, res) => {
  try {
    const persona = await Persona.findAll({
      where: {
        nombre: req.params.nombre
      }
    });
    res.json(persona);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear
router.post('/', async (req, res) => {
  try {
    const nuevaPersona = await Persona.create(req.body);
    res.status(201).json(nuevaPersona);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Editar
router.put('/:id', async (req, res) => {
  try {
    const persona = await Persona.findByPk(req.params.id);
    if (persona) {
      await persona.update(req.body);
      res.json(persona);
    } else {
      res.status(404).json({ message: 'Persona no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar
router.delete('/:id', async (req, res) => {
  try {
    const persona = await Persona.findByPk(req.params.id);
    if (persona) {
      await persona.destroy();
      res.json({ message: 'Persona eliminada' });
    } else {
      res.status(404).json({ message: 'Persona no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
