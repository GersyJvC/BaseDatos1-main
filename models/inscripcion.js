'use strict';

module.exports = (sequelize, DataTypes) => {
  const Inscripcion = sequelize.define('Inscripcion', {
    estudianteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'estudianteId' // ¡Fuerza el nombre exacto de la columna!
    },
    asignaturaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true, // Si no tienes restricciones, puedes permitir que sea nulo
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true, // Lo mismo aquí
    }
  }, {
    tableName: 'Inscripciones', // El nombre correcto de la tabla en MySQL
    timestamps: true, // Usamos timestamps si tienes 'createdAt' y 'updatedAt' en la base de datos
  });

  // Definir las asociaciones
  Inscripcion.associate = function(models) {
    // Relación con el modelo 'Estudante'
    Inscripcion.belongsTo(models.Estudante, {
      foreignKey: 'estudianteId',
      as: 'estudante', // Asegúrate de que el alias coincida con el que usas en las consultas
    });

    // Relación con el modelo 'Asignatura'
    Inscripcion.belongsTo(models.Asignatura, {
      foreignKey: 'asignaturaId',
      as: 'asignatura', // Lo mismo aquí
    });
  };

  return Inscripcion;
};
