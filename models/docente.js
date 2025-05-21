'use strict';
module.exports = (Sequelize, DataTypes) => {
  const Docente = Sequelize.define('Docente', {
    nombre: DataTypes.STRING,
    email: DataTypes.STRING,
  }, {});

  Docente.associate = function(models) {
    // Muchos a muchos con Asignatura a través de Contrato
    Docente.belongsToMany(models.Asignatura, {
      through: 'Contrato',
      as: 'asignaturas',
      foreignKey: 'docenteId',
    });

    // Relación directa con Contrato (opcional, si necesitas acceder a los contratos directamente)
    Docente.hasMany(models.Contrato, {
      foreignKey: 'docenteId',
      as: 'contratos',
    });
  };

  return Docente;
};
