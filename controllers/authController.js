// controllers/authController.js
const bcrypt = require("bcrypt");
const { Usuario } = require("../models");

exports.registrar = async (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  try {
    // Verifica si ya existe un usuario con ese correo
    const usuarioExistente = await Usuario.findOne({ where: { correo } });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    // Hashear la contraseña
    const hash = await bcrypt.hash(contrasena, 10);

    // Crear usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      correo,
      contrasena: hash,
    });

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
      },
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar", error });
  }
};

exports.registrar = async (req, res) => { /*...*/ };
exports.login = async (req, res) => { /*...*/ };

