const express = require('express');
const router = express.Router();
const { Contrato, Docente, Asignatura } = require('../models');

// Obtener todos los contratos con detalles
router.get('/', async (req, res) => {
  try {
    const contratos = await Contrato.findAll({
      include: [
        { model: Docente, as: 'docente' },
        { model: Asignatura, as: 'asignatura' }
      ]
    });
    res.json(contratos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener contrato por ID
router.get('/:id', async (req, res) => {
  try {
    const contrato = await Contrato.findByPk(req.params.id, {
      include: [
        { model: Docente, as: 'docente' },
        { model: Asignatura, as: 'asignatura' }
      ]
    });
    contrato
      ? res.json(contrato)
      : res.status(404).json({ message: 'Contrato no encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear nuevo contrato (verifica existencia de docente y asignatura)
router.post('/', async (req, res) => {
  const { docenteid, asignaturaid } = req.body;

  try {
    const docente = await Docente.findByPk(docenteid);
    const asignatura = await Asignatura.findByPk(asignaturaid);

    if (!docente || !asignatura) {
      return res.status(400).json({
        error: 'Docente o Asignatura no existe'
      });
    }

    const nuevoContrato = await Contrato.create(req.body);
    res.status(201).json(nuevoContrato);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Editar contrato
router.put('/:id', async (req, res) => {
  try {
    const contrato = await Contrato.findByPk(req.params.id);
    if (contrato) {
      await contrato.update(req.body);
      res.json(contrato);
    } else {
      res.status(404).json({ message: 'Contrato no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar contrato
router.delete('/:id', async (req, res) => {
  try {
    const contrato = await Contrato.findByPk(req.params.id);
    if (contrato) {
      await contrato.destroy();
      res.json({ message: 'Contrato eliminado' });
    } else {
      res.status(404).json({ message: 'Contrato no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener contratos de un docente específico
router.get('/docente/:id', async (req, res) => {
  try {
    const contratos = await Contrato.findAll({
      where: { docenteid: req.params.id },
      include: { model: Asignatura, as: 'asignatura' }
    });
    res.json(contratos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener contratos de una asignatura específica
router.get('/asignatura/:id', async (req, res) => {
  try {
    const contratos = await Contrato.findAll({
      where: { asignaturaid: req.params.id },
      include: { model: Docente, as: 'docente' }
    });
    res.json(contratos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
