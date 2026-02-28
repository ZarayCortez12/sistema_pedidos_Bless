"use strict";

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert("usuario_roles", [
      {
        usuarioId: 1,
        rolId: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        usuarioId: 2,
        rolId: 2,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("usuario_roles", null, {});
  },
};
