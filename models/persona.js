'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Persona extends Model {
    static associate(models) {
      // define associations here si es necesario
    }
  }

  Persona.init({
    nombre: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize, //  ahora sí existe
    modelName: 'Persona',
  });

  return Persona;
};
