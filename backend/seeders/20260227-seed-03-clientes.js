'use strict';

module.exports = {
  async up(queryInterface) {

    await queryInterface.bulkInsert('clientes', [
      {
        documento: '10101010',
        nombres: 'Carlos',
        apellidos: 'Ramírez',
        email: 'carlos@gmail.com',
        direccion: 'Calle 10 #12-34',
        telefono: '3001234567',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        documento: '20202020',
        nombres: 'Laura',
        apellidos: 'Martínez',
        email: 'laura@hotmail.com',
        direccion: 'Cra 5 #20-11',
        telefono: '3017654321',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        documento: '30303030',
        nombres: 'Andrés',
        apellidos: 'Gómez',
        email: 'andres@test.com',
        direccion: 'Av Siempre Viva 123',
        telefono: '3029988776',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        documento: '40404040',
        nombres: 'Paola',
        apellidos: 'Hernández',
        email: 'paola@yahoo.com',
        direccion: 'Cra 15 #45-67',
        telefono: '3105566778',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        documento: '50505050',
        nombres: 'Javier',
        apellidos: 'Torres',
        email: 'javier@outlook.com',
        direccion: 'Calle 80 #30-22',
        telefono: '3123344556',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('clientes', null, {});
  },
};