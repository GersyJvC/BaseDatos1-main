'use strict';

module.exports = (Sequelize, DataTypes) => {
  const Asignatura = Sequelize.define('Asignatura', {
    clave: {  // Cambié de 'codigo' a 'clave'
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // Agrega otras propiedades si es necesario
  }, {
    tableName: 'Asignaturas', // Si no deseas que Sequelize pluralice la tabla
    timestamps: false
  });

  Asignatura.associate = function(models) {
    // Define las relaciones de la tabla Asignaturas con otras tablas
    Asignatura.hasMany(models.Inscripcion, { foreignKey: 'asignaturaId' });
    Asignatura.belongsToMany(models.Estudante, {
      through: models.Inscripcion,
      foreignKey: 'asignaturaId',
      as: 'estudiantes'
    });
  };

  return Asignatura;
};
