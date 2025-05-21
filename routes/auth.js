// routes/auth.js
const express = require('express')
const router = express.Router()
const { Usuario } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const passport = require('passport')

// Login con Passport local
router.post('/passport-login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)
    if (!user) return res.status(401).json({ message: info.message })

    req.logIn(user, (err) => {
      if (err) return next(err)
      res.status(200).json({ message: 'Login con Passport exitoso', user })
    })
  })(req, res, next)
})


router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const usuario = await Usuario.findOne({ where: { email } })
  if (!usuario) {
    return res.status(401).json({ message: 'Usuario no encontrado' })
  }

  const isValid = await bcrypt.compare(password, usuario.password)
  if (!isValid) {
    return res.status(401).json({ message: 'Contraseña incorrecta' })
  }

  // Si quieres puedes devolver un token aquí, o solo confirmar login
  return res.status(200).json({ message: 'Login exitoso', usuario })
})

module.exports = router
