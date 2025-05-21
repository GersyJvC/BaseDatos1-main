'use strict';

module.exports = (Sequelize, DataTypes) => {
  const Asignatura = Sequelize.define('Asignatura', {
    clave: {  // Asegúrate de que aquí se use 'clave' en lugar de 'codigo'
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // Otras propiedades si las tienes
  }, {
    tableName: 'Asignaturas', // No dejes que sequelize pluralice la tabla
    timestamps: true,
    createdAt: 'fechaInscripcion', // nombre personalizado para createdAt
    updatedAt: 'updatedAt'         // deja este si se llama así en tu tabla
  });

  Asignatura.associate = function(models) {
    Asignatura.hasMany(models.Inscripcion, { foreignKey: 'asignaturaId' });
    Asignatura.belongsToMany(models.Docente, {
      through: 'Contrato',
      as: 'docentes',
      foreignKey: 'asignaturaId'
    });
    
    Asignatura.belongsToMany(models.Estudante, {
      through: 'Inscripcion',
      as: 'estudantes',
      foreignKey: 'asignaturaId'
    });    
  };

  return Asignatura;
};
