'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contrato extends Model {
    static associate(models) {
      // No es obligatorio poner asociaciones aquí si ya están en Docente y Asignatura
    }
  }

  Contrato.init({
    docenteId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Docentes',  // nombre exacto de la tabla
        key: 'id'
      }
    },
    asignaturaId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Asignaturas',  // nombre exacto de la tabla
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Contrato',
  });

  return Contrato;
};
