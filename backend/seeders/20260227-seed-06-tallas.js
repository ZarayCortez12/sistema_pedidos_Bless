"use strict";

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert("tallas", [
      {
        nombre: "28",
        createdAt: now,
        updatedAt: now,
      },
      {
        nombre: "30",
        createdAt: now,
        updatedAt: now,
      },
      {
        nombre: "32",
        createdAt: now,
        updatedAt: now,
      },
      {
        nombre: "34",
        createdAt: now,
        updatedAt: now,
      },
      {
        nombre: "36",
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("tallas", null, {});
  },
};
