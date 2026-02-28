"use strict";

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert("pedidos", [
      {
        clienteId: 1,
        usuarioId: 1,
        total: 200000,
        fecha: new Date("2026-02-20"),
        createdAt: now,
        updatedAt: now,
      },
      {
        clienteId: 2,
        usuarioId: 1,
        total: 196000,
        fecha: new Date("2026-02-21"),
        createdAt: now,
        updatedAt: now,
      },
      {
        clienteId: 3,
        usuarioId: 1,
        total: 308000,
        fecha: new Date("2026-02-22"),
        createdAt: now,
        updatedAt: now,
      },
      {
        clienteId: 4,
        usuarioId: 1,
        total: 95000,
        fecha: new Date("2026-02-23"),
        createdAt: now,
        updatedAt: now,
      },
      {
        clienteId: 5,
        usuarioId: 1,
        total: 215000,
        fecha: new Date("2026-02-24"),
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("pedidos", null, {});
  },
};
