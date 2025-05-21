'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Personas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Personas');
  }
};
