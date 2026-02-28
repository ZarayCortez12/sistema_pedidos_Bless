"use strict";

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert("detalle_pedidos", [
      // ===== Pedido 1 (2 productos) =====
      {
        pedidoId: 1,
        productoId: 1, // Jean Clásico
        tallaId: 3, // 32
        cantidad: 1,
        precio_unitario: 95000,
        subtotal: 95000,
        createdAt: now,
        updatedAt: now,
      },
      {
        pedidoId: 1,
        productoId: 2, // Jean Skinny
        tallaId: 2, // 30
        cantidad: 1,
        precio_unitario: 105000,
        subtotal: 105000,
        createdAt: now,
        updatedAt: now,
      },

      // ===== Pedido 2 (1 producto) =====
      {
        pedidoId: 2,
        productoId: 3, // Jean Negro
        tallaId: 4, // 34
        cantidad: 2,
        precio_unitario: 98000,
        subtotal: 196000,
        createdAt: now,
        updatedAt: now,
      },

      // ===== Pedido 3 (2 productos) =====
      {
        pedidoId: 3,
        productoId: 4, // Mom Fit
        tallaId: 3, // 32
        cantidad: 1,
        precio_unitario: 110000,
        subtotal: 110000,
        createdAt: now,
        updatedAt: now,
      },
      {
        pedidoId: 3,
        productoId: 5, // Slim Fit
        tallaId: 2, // 30
        cantidad: 2,
        precio_unitario: 99000,
        subtotal: 198000,
        createdAt: now,
        updatedAt: now,
      },

      // ===== Pedido 4 (1 producto) =====
      {
        pedidoId: 4,
        productoId: 1,
        tallaId: 1, // 28
        cantidad: 1,
        precio_unitario: 95000,
        subtotal: 95000,
        createdAt: now,
        updatedAt: now,
      },

      // ===== Pedido 5 (2 productos) =====
      {
        pedidoId: 5,
        productoId: 2,
        tallaId: 3, // 32
        cantidad: 1,
        precio_unitario: 105000,
        subtotal: 105000,
        createdAt: now,
        updatedAt: now,
      },
      {
        pedidoId: 5,
        productoId: 4,
        tallaId: 4, // 34
        cantidad: 1,
        precio_unitario: 110000,
        subtotal: 110000,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("detalle_pedidos", null, {});
  },
};
