const express = require('express');
const session = require('express-session')
const passport = require('passport')

require('./config/passport')(passport)

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
  secret: 'tu_secreto_aqui',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

const usuariosRoutes = require('./routes/usuarios');
const personaRoutes = require('./routes/persona');
const docenteRoutes = require('./routes/docente');
const estudanteRoutes = require('./routes/estudante');
const asignaturaRoutes = require('./routes/asignatura');
const inscripcionRoutes = require('./routes/inscripcion');
const contratoRoutes = require('./routes/contrato');

const cors = require('cors');
app.use(cors());

app.use(express.json());

app.use("/api/auth", require("./routes/auth"));

const estudantesRouter = require('./routes/estudante')
app.use('/api/estudante', estudantesRouter)

app.use('/api/usuarios', usuariosRoutes);

// Rutas principales
app.use('/api/personas', personaRoutes);
app.use('/api/docentes', docenteRoutes);
app.use('/api/estudantes', estudanteRoutes);
app.use('/api/asignaturas', asignaturaRoutes);
app.use('/api/inscripciones', inscripcionRoutes);
app.use('/api/contratos', contratoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});