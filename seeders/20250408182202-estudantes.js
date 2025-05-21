'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Estudantes', [
      {
        Matricula: 1234,
        Nombre: 'Federico Paez',
        Email: 'federico.paez@example.com',
        personaId: 1, // Asegúrate de que este ID exista en la tabla Personas
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Matricula: 5678,
        Nombre: 'Laura Gómez',
        Email: 'laura.gomez@example.com',
        personaId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Estudantes', null, {});
  }
};
