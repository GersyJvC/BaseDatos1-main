const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { Usuario } = require('../models') // o el nombre de tu modelo

module.exports = function (passport) {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async (email, password, done) => {
    try {
      const user = await Usuario.findOne({ where: { email } })
      if (!user) return done(null, false, { message: 'Usuario no encontrado' })

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) return done(null, false, { message: 'Contraseña incorrecta' })

      return done(null, user)
    } catch (error) {
      return done(error)
    }
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await Usuario.findByPk(id)
      done(null, user)
    } catch (err) {
      done(err)
    }
  })
}
