'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Contratos', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      docenteId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Docentes', // El nombre de la tabla Docente
          key: 'id',
        },
        onDelete: 'CASCADE'
      },
      asignaturaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Asignaturas', // El nombre de la tabla Asignatura
          key: 'id',
        },
        onDelete: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Contratos');
  }
};
