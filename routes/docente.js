const express = require('express');
const router = express.Router();
const { Docente, Asignatura, Estudante } = require('../models');

// Buscar docente por nombre
const { Op } = require('sequelize');

// Obtener docente con sus asignaturas y estudiantes
router.get('/nombre/:nombre', async (req, res) => {
  try {
    const docente = await Docente.findOne({
      where: {
        nombre: {
          [Op.like]: `%${req.params.nombre}%`
        }
      },
      include: {
        model: Asignatura,
        as: 'asignaturas',
        include: {
          model: Estudante,
          as: 'estudantes'
        }
      }
    });

    if (!docente) {
      return res.status(404).json({ message: 'Docente no encontrado' });
    }

    res.json(docente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


// Agregar asignatura a docente
router.post('/:docenteId/asignaturas/:asignaturaId', async (req, res) => {
  const { docenteId, asignaturaId } = req.params;

  try {
    const docente = await Docente.findByPk(docenteId);
    const asignatura = await Asignatura.findByPk(asignaturaId);

    if (!docente || !asignatura) {
      return res.status(404).json({ message: 'Docente o asignatura no encontrados' });
    }

    await docente.addAsignatura(asignatura);  // Asocia la asignatura al docente
    res.status(201).json({ message: 'Asignatura agregada al docente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los docentes sin incluir asignaturas ni estudiantes
router.get('/', async (req, res) => {
  try {
    const docentes = await Docente.findAll(); // ← solo docentes
    res.json(docentes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete('/:id/asignaturas/:clave', async (req, res) => {
  try {
    const docente = await Docente.findByPk(req.params.id);
    const asignatura = await Asignatura.findByPk(req.params.clave);

    if (!docente || !asignatura) {
      return res.status(404).json({ message: 'Docente o asignatura no encontrados' });
    }

    await docente.removeAsignatura(asignatura);
    res.json({ message: 'Asignatura eliminada del docente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




// Obtener un docente por ID con sus asignaturas y los estudiantes inscrito

// Crear docente (con asignaturas opcionales)
router.post('/', async (req, res) => {
  const { asignaturas, ...docenteData } = req.body;

  try {
    const nuevoDocente = await Docente.create(docenteData);

    if (asignaturas && asignaturas.length > 0) {
      await nuevoDocente.setAsignaturas(asignaturas);
    }

    res.status(201).json(nuevoDocente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Editar
router.put('/:id', async (req, res) => {
  try {
    const docente = await Docente.findByPk(req.params.id);
    if (docente) {
      await docente.update(req.body);
      res.json(docente);
    } else {
      res.status(404).json({ message: 'Docente no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar
router.delete('/:id', async (req, res) => {
  try {
    const docente = await Docente.findByPk(req.params.id);
    if (docente) {
      await docente.destroy();
      res.json({ message: 'Docente eliminado' });
    } else {
      res.status(404).json({ message: 'Docente no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/asignaturas/:asignaturaId/docentes/:docenteId
router.delete('/:asignaturaId/docentes/:docenteId', async (req, res) => {
  const { asignaturaId, docenteId } = req.params;
  try {
    const asignatura = await Asignatura.findByPk(asignaturaId);
    if (!asignatura) return res.status(404).json({ message: 'Asignatura no encontrada' });

    await asignatura.removeDocente(docenteId); // Sequelize también crea este método automáticamente
    res.json({ message: 'Docente eliminado de la asignatura' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/docente/:id/asignaturas-simples
router.get('/:id/asignaturas', async (req, res) => {
  try {
    const docente = await Docente.findByPk(req.params.id, {
      include: {
        model: Asignatura,
        as: 'asignaturas',
        through: { attributes: [] } // Oculta la tabla intermedia Contrato
      }
    });

    if (!docente) {
      return res.status(404).json({ message: 'Docente no encontrado' });
    }

    res.json(docente.asignaturas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/docente/:id/estudiantes-simples
router.get('/:id/estudiantes', async (req, res) => {
  try {
    const docente = await Docente.findByPk(req.params.id, {
      include: {
        model: Asignatura,
        as: 'asignaturas',
        include: {
          model: Estudante,
          as: 'estudantes',
          through: { attributes: [] } // Oculta la tabla Inscripcion
        },
        through: { attributes: [] } // Oculta la tabla Contrato
      }
    });

    if (!docente) {
      return res.status(404).json({ message: 'Docente no encontrado' });
    }

    // Extraer estudiantes únicos
    const estudiantes = [];
    const idsAgregados = new Set();

    for (const asignatura of docente.asignaturas) {
      for (const estudiante of asignatura.estudantes) {
        if (!idsAgregados.has(estudiante.id)) {
          estudiantes.push(estudiante);
          idsAgregados.add(estudiante.id);
        }
      }
    }

    res.json(estudiantes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
