"use strict";

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert("productos", [
      {
        nombre: "Jean Clásico Azul Hombre",
        codigo: "JEAN-H-001",
        precio: 95000,
        createdAt: now,
        updatedAt: now,
      },
      {
        nombre: "Jean Skinny Mujer Azul Oscuro",
        codigo: "JEAN-M-002",
        precio: 105000,
        createdAt: now,
        updatedAt: now,
      },
      {
        nombre: "Jean Recto Hombre Negro",
        codigo: "JEAN-H-003",
        precio: 98000,
        createdAt: now,
        updatedAt: now,
      },
      {
        nombre: "Jean Mom Fit Mujer Celeste",
        codigo: "JEAN-M-004",
        precio: 110000,
        createdAt: now,
        updatedAt: now,
      },
      {
        nombre: "Jean Slim Fit Hombre Azul Claro",
        codigo: "JEAN-H-005",
        precio: 99000,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("productos", null, {});
  },
};
