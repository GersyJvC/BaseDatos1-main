'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Estudantes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Matricula: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false
      },
      Nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      correo: {
        type: Sequelize.STRING,
        defaultValue: 'notengoemail@gmail.com',  // Cambié toDefaultValue por defaultValue
        allowNull: false
      },
      imagen: {
        type: Sequelize.BLOB
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Estudantes');
  }
};
