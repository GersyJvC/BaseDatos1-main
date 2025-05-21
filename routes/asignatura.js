const express = require('express');
const { Op } = require('sequelize'); // Asegúrate de tener esto
const router = express.Router();
const { Asignatura, Docente, Estudante } = require('../models');

// Buscar asignatura por clave
router.get('/clave/:clave', async (req, res) => {
  try {
    const asignatura = await Asignatura.findOne({
      where: { clave: req.params.clave },
      include: [
        {
          model: Docente,
          as: 'docentes'
        },
        {
          model: Estudante,
          as: 'estudantes'
        }
      ]
    });

    if (!asignatura) return res.status(404).json({ message: 'Asignatura no encontrada' });

    res.json(asignatura);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/', async (req, res) => {
  console.log('Creando nueva asignatura con datos:', req.body);  // Log para depurar

  try {
    const nuevaAsignatura = await Asignatura.create(req.body);
    res.status(201).json(nuevaAsignatura);
  } catch (error) {
    console.error('Error al crear asignatura:', error);  // Log para depurar
    res.status(400).json({ error: error.message });
  }
});

// Para eliminar
router.delete('/:clave', async (req, res) => {
  const clave = req.params.clave;
  const asignatura = await Asignatura.findOne({ where: { clave } });
  if (!asignatura) return res.status(404).json({ error: 'No encontrada' });

  await asignatura.destroy();
  res.json({ mensaje: 'Eliminada correctamente' });
});

// Para actualizar
router.put('/:clave', async (req, res) => {
  const clave = req.params.clave;
  const asignatura = await Asignatura.findOne({ where: { clave } });
  if (!asignatura) return res.status(404).json({ error: 'No encontrada' });

  await asignatura.update(req.body);
  res.json(asignatura);
});


// Obtener todas las asignaturas con docentes y estudiantes asociados
router.get('/', async (req, res) => {
  try {
    const asignaturas = await Asignatura.findAll({
      include: [
        { model: Docente, as: 'docentes' },
        { model: Estudante, as: 'estudantes' }
      ]
    });
    res.json(asignaturas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener asignatura por ID
router.get('/:id', async (req, res) => {
  try {
    const asignatura = await Asignatura.findByPk(req.params.id, {
      include: [
        { model: Docente, as: 'docentes' },
        { model: Estudante, as: 'estudantes' }
      ]
    });

    asignatura
      ? res.json(asignatura)
      : res.status(404).json({ message: 'Asignatura no encontrada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear nueva asignatura
router.post('/', async (req, res) => {
  try {
    const nuevaAsignatura = await Asignatura.create(req.body);
    res.status(201).json(nuevaAsignatura);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Editar asignatura
router.put('/:id', async (req, res) => {
  try {
    const asignatura = await Asignatura.findByPk(req.params.id);
    if (asignatura) {
      await asignatura.update(req.body);
      res.json(asignatura);
    } else {
      res.status(404).json({ message: 'Asignatura no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar asignatura
router.delete('/:id', async (req, res) => {
  try {
    const asignatura = await Asignatura.findByPk(req.params.id);
    if (asignatura) {
      await asignatura.destroy();
      res.json({ message: 'Asignatura eliminada' });
    } else {
      res.status(404).json({ message: 'Asignatura no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener estudiantes de una asignatura
router.get('/:id/estudantes', async (req, res) => {
  try {
    const asignatura = await Asignatura.findByPk(req.params.id, {
      include: { model: Estudante, as: 'estudantes' }
    });

    if (!asignatura) {
      return res.status(404).json({ message: 'Asignatura no encontrada' });
    }

    res.json(asignatura.estudantes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener docentes de una asignatura
router.get('/:id/docentes', async (req, res) => {
  try {
    const asignatura = await Asignatura.findByPk(req.params.id, {
      include: { model: Docente, as: 'docentes' }
    });

    if (!asignatura) {
      return res.status(404).json({ message: 'Asignatura no encontrada' });
    }

    res.json(asignatura.docentes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar estudiante de asignatura
router.delete('/:asignaturaId/estudantes/:estudanteId', async (req, res) => {
  try {
    const asignatura = await Asignatura.findByPk(req.params.asignaturaId);
    if (!asignatura) return res.status(404).json({ message: 'Asignatura no encontrada' });

    await asignatura.removeEstudante(req.params.estudanteId);
    res.json({ message: 'Estudiante eliminado de la asignatura' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar docente de asignatura
router.delete('/:asignaturaId/docentes/:docenteId', async (req, res) => {
  try {
    const asignatura = await Asignatura.findByPk(req.params.asignaturaId);
    if (!asignatura) return res.status(404).json({ message: 'Asignatura no encontrada' });

    await asignatura.removeDocente(req.params.docenteId);
    res.json({ message: 'Docente eliminado de la asignatura' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar estudiante a asignatura
router.post('/:asignaturaId/estudantes/:estudanteId', async (req, res) => {
  try {
    const asignatura = await Asignatura.findByPk(req.params.asignaturaId);
    if (!asignatura) return res.status(404).json({ message: 'Asignatura no encontrada' });

    await asignatura.addEstudante(req.params.estudanteId);
    res.json({ message: 'Estudiante agregado a la asignatura' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar docente a asignatura
router.post('/:asignaturaId/docentes/:docenteId', async (req, res) => {
  try {
    const asignatura = await Asignatura.findByPk(req.params.asignaturaId);
    if (!asignatura) return res.status(404).json({ message: 'Asignatura no encontrada' });

    await asignatura.addDocente(req.params.docenteId);
    res.json({ message: 'Docente agregado a la asignatura' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
