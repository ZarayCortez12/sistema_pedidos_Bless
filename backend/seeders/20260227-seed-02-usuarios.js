"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface) {
    const password = await bcrypt.hash("123456", 10);

    await queryInterface.bulkInsert("usuarios", [
      {
        documento: "100200300",
        nombres: "Admin",
        apellidos: "Principal",
        email: "admin@bless.com",
        clave: password,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        documento: "400500600",
        nombres: "Maria",
        apellidos: "Gomez",
        email: "maria@test.com",
        clave: password,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("usuarios", null, {});
  },
};
