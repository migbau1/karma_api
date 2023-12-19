'use strict';


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    return queryInterface.bulkInsert('roles', [
      {
        id: "20864331-4d42-4e77-b565-d44e90adfef9",
        name: 'admin'
      },
      {
        id: "7a62e6a1-ce40-4a52-8aa7-a7e4c85243ac",
        name: "cliente"
      }
    ])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('roles', null, {});
  }
};
