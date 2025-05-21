'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Docentes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      numEmpleado: {
        type: Sequelize.INTEGER,
        allowNull: false,  // Asegúrate de que no sea nulo
        unique: true,  // El número de empleado debe ser único
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false,  // No debe ser nulo
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,  // No debe ser nulo
        unique: true,  // El email debe ser único
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Docentes');
  }
};
