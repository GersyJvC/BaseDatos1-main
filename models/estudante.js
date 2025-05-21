'use strict';
module.exports = (Sequelize, DataTypes) => {
  const Estudante = Sequelize.define('Estudante', {
    nombre: DataTypes.STRING,
    correo: DataTypes.STRING,
    matricula: DataTypes.STRING,
  }, {});

  Estudante.associate = function(models) {
    // Muchos a muchos con Asignatura a través de Inscripcion
    Estudante.belongsToMany(models.Asignatura, {
      through: 'Inscripcion',
      as: 'asignaturas',
      foreignKey: 'estudianteId',
      otherKey: 'asignaturaId'
    });

    // Relación directa con Inscripcion (opcional si necesitas acceder a ellas)
    Estudante.hasMany(models.Inscripcion, {
      foreignKey: 'estudianteId',
      as: 'inscripciones',
    });
  };

  return Estudante;
};
