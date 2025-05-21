const express = require('express');
const router = express.Router();
const { Estudante, Asignatura, Inscripcion, Docente } = require('../models');

// Obtener todos los estudiantes
// Obtener estudiante por matrícula (no por ID)

router.get('/', async (req, res) => {
  const estudiantes = await Estudante.findAll()
  res.json(estudiantes)
})

router.get('/:matricula', async (req, res) => {
  try {
    const estudante = await Estudante.findOne({
      where: { matricula: req.params.matricula },
      include: {
        model: Asignatura,
        as: 'asignaturas',
        include: {
          model: Docente,
          as: 'docentes'
        }
      }
    })

    if (!estudante) {
      return res.status(404).json({ message: 'Estudiante no encontrado' })
    }

    res.json(estudante)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    console.log('Datos recibidos para crear estudiante:', req.body) // 👈
    const { matricula, nombre, correo } = req.body;
    const estudiante = await Estudante.create({ matricula, nombre, correo });
    res.status(201).json(estudiante)
  } catch (error) {
    console.error('Error al crear estudiante:', error)
    res.status(500).json({ error: 'No se pudo crear el estudiante' })
  }
})



// GET /api/estudantes/:id/docentes
router.get('/:id/docentes', async (req, res) => {
  try {
    const estudiante = await Estudante.findByPk(req.params.id, {
      include: {
        model: Asignatura,
        as: 'asignaturas',
        include: {
          model: Docente,
          as: 'docentes',
          through: { attributes: [] } // No mostrar la tabla intermedia Contrato
        },
        through: { attributes: [] } // No mostrar la tabla intermedia Inscripcion
      }
    });

    if (!estudiante) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    // Extraer los docentes únicos
    const docentes = [];
    const idsAgregados = new Set();

    for (const asignatura of estudiante.asignaturas) {
      for (const docente of asignatura.docentes) {
        if (!idsAgregados.has(docente.id)) {
          docentes.push(docente);
          idsAgregados.add(docente.id);
        }
      }
    }

    res.json(docentes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar asignatura al estudiante por clave
router.post('/:matricula/asignaturas', async (req, res) => {
  const { clave } = req.body;
  try {
    const estudiante = await Estudante.findOne({ where: { matricula: req.params.matricula } });
    const asignatura = await Asignatura.findOne({ where: { clave } });

    if (!estudiante || !asignatura)
      return res.status(404).json({ message: 'Estudiante o asignatura no encontrada' });

    await estudiante.addAsignatura(asignatura);
    res.json({ message: 'Asignatura agregada al estudiante' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar asignatura del estudiante
router.delete('/:matricula/asignaturas/:clave', async (req, res) => {
  try {
    const estudiante = await Estudante.findOne({ where: { matricula: req.params.matricula } });
    const asignatura = await Asignatura.findOne({ where: { clave: req.params.clave } });

    if (!estudiante || !asignatura)
      return res.status(404).json({ message: 'Estudiante o asignatura no encontrada' });

    await estudiante.removeAsignatura(asignatura);
    res.json({ message: 'Asignatura eliminada del estudiante' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Editar estudiante
router.put('/:matricula', async (req, res) => {
  try {
    const estudiante = await Estudante.findOne({ where: { matricula: req.params.matricula } });
    if (!estudiante) return res.status(404).json({ message: 'Estudiante no encontrado' });

    await estudiante.update(req.body);
    res.json(estudiante);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/estudantes/:matricula
router.put('/:matricula', async (req, res) => {
  try {
    const estudante = await Estudante.findOne({ where: { matricula: req.params.matricula } })
    if (!estudante) {
      return res.status(404).json({ error: 'Estudiante no encontrado' })
    }

    await estudante.update({ nombre: req.body.nombre })
    res.json({ message: 'Estudiante actualizado correctamente' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al actualizar el estudiante' })
  }
})

// DELETE /api/estudantes/:matricula
router.delete('/:matricula', async (req, res) => {
  try {
    const estudante = await Estudante.findOne({ where: { matricula: req.params.matricula } })
    if (!estudante) {
      return res.status(404).json({ error: 'Estudiante no encontrado' })
    }

    await estudante.destroy()
    res.json({ message: 'Estudiante eliminado correctamente' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al eliminar el estudiante' })
  }
})


// Eliminar estudiante
router.delete('/:matricula', async (req, res) => {
  try {
    const estudiante = await Estudante.findOne({ where: { matricula: req.params.matricula } });
    if (!estudiante) return res.status(404).json({ message: 'Estudiante no encontrado' });

    await estudiante.destroy();
    res.json({ message: 'Estudiante eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/estudantes/:matricula
router.get('/:matricula', async (req, res) => {
  try {
    const estudante = await Estudante.findOne({
      where: { matricula: req.params.matricula },
      include: {
        model: Asignatura,
        through: { attributes: [] }, // para ocultar tabla intermedia
        include: {
          model: Docente,
          through: { attributes: [] } // si también hay tabla intermedia entre docente-asignatura
        }
      }
    })

    if (!estudante) {
      return res.status(404).json({ message: 'Estudiante no encontrado' })
    }

    res.json(estudante)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})


// GET /api/estudantes/:id/asignaturas-simples
router.get('/:id/asignaturas', async (req, res) => {
  try {
    const estudiante = await Estudante.findByPk(req.params.id, {
      include: {
        model: Asignatura,
        as: 'asignaturas',
        through: { attributes: [] } // Oculta la tabla intermedia Inscripcion
      }
    });

    if (!estudiante) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    res.json(estudiante.asignaturas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
