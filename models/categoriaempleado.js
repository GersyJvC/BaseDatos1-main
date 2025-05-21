'use strict';

module.exports = (Sequelize, DataTypes) => {
  const CategoriaEmpleado = Sequelize.define('CategoriaEmpleado', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'CategoriaEmpleado', // Asegúrate que el nombre de la tabla sea correcto
    timestamps: false
  });

  CategoriaEmpleado.associate = function(models) {
    // Aquí puedes definir las asociaciones
  };

  return CategoriaEmpleado;
};
