const express = require('express');
const router = express.Router();
const { Inscripcion, Estudante, Asignatura } = require('../models');

// Obtener todas las inscripciones con detalles
router.get('/', async (req, res) => {
  try {
    const inscripciones = await Inscripcion.findAll({
      include: [
        { model: Estudante, as: 'estudante' },
        { model: Asignatura, as: 'asignatura' }
      ]
    });
    res.json(inscripciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener inscripción por ID
router.get('/:id', async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findByPk(req.params.id, {
      include: [
        { model: Estudante, as: 'estudante' },
        { model: Asignatura, as: 'asignatura' }
      ]
    });
    inscripcion
      ? res.json(inscripcion)
      : res.status(404).json({ message: 'Inscripción no encontrada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear inscripción (valida que estudiante y asignatura existan)
router.post('/', async (req, res) => {
  const { estudianteId, asignaturaid } = req.body;

  try {
    const estudiante = await Estudante.findByPk(estudianteId);
    const asignatura = await Asignatura.findByPk(asignaturaid);

    if (!estudiante || !asignatura) {
      return res.status(400).json({
        error: 'Estudiante o Asignatura no existe'
      });
    }

    const nuevaInscripcion = await Inscripcion.create(req.body);
    res.status(201).json(nuevaInscripcion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Editar inscripción
router.put('/:id', async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findByPk(req.params.id);
    if (inscripcion) {
      await inscripcion.update(req.body);
      res.json(inscripcion);
    } else {
      res.status(404).json({ message: 'Inscripción no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar inscripción
router.delete('/:id', async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findByPk(req.params.id);
    if (inscripcion) {
      await inscripcion.destroy();
      res.json({ message: 'Inscripción eliminada' });
    } else {
      res.status(404).json({ message: 'Inscripción no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener inscripciones de un estudiante específico
router.get('/estudiante/:id', async (req, res) => {
  try {
    const inscripciones = await Inscripcion.findAll({
      where: { estudianteId: req.params.id },  // ← camelCase aquí
      include: { model: Asignatura, as: 'asignatura' }
    });
    logging: console.log
    res.json(inscripciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener inscripciones de una asignatura específica
router.get('/asignatura/:id', async (req, res) => {
  try {
    const inscripciones = await Inscripcion.findAll({
      where: { asignaturaId: req.params.id },
      include: { model: Estudante, as: 'estudante' }
    });
    res.json(inscripciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
