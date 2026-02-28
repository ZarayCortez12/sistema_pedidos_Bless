"use strict";

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert("producto_tallas", [
      // Producto 1
      { productoId: 1, tallaId: 1, stock: 25, createdAt: now, updatedAt: now },
      { productoId: 1, tallaId: 2, stock: 30, createdAt: now, updatedAt: now },
      { productoId: 1, tallaId: 3, stock: 40, createdAt: now, updatedAt: now },
      { productoId: 1, tallaId: 4, stock: 20, createdAt: now, updatedAt: now },

      // Producto 2
      { productoId: 2, tallaId: 2, stock: 35, createdAt: now, updatedAt: now },
      { productoId: 2, tallaId: 3, stock: 45, createdAt: now, updatedAt: now },
      { productoId: 2, tallaId: 4, stock: 25, createdAt: now, updatedAt: now },

      // Producto 3
      { productoId: 3, tallaId: 1, stock: 15, createdAt: now, updatedAt: now },
      { productoId: 3, tallaId: 2, stock: 20, createdAt: now, updatedAt: now },
      { productoId: 3, tallaId: 3, stock: 30, createdAt: now, updatedAt: now },
      { productoId: 3, tallaId: 4, stock: 18, createdAt: now, updatedAt: now },

      // Producto 4
      { productoId: 4, tallaId: 2, stock: 22, createdAt: now, updatedAt: now },
      { productoId: 4, tallaId: 3, stock: 28, createdAt: now, updatedAt: now },
      { productoId: 4, tallaId: 4, stock: 15, createdAt: now, updatedAt: now },

      // Producto 5
      { productoId: 5, tallaId: 1, stock: 18, createdAt: now, updatedAt: now },
      { productoId: 5, tallaId: 2, stock: 26, createdAt: now, updatedAt: now },
      { productoId: 5, tallaId: 3, stock: 35, createdAt: now, updatedAt: now },
      { productoId: 5, tallaId: 4, stock: 20, createdAt: now, updatedAt: now },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("producto_tallas", null, {});
  },
};
