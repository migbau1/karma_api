'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const transaction = await queryInterface.sequelize.transaction()
    try {

      await queryInterface.addColumn('facturacion', 'pay_mode', {
        type: Sequelize.STRING,
        defaultValue: "Contado",
        transaction
      })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface, Sequelize) {

    const transaction = await queryInterface.sequelize.transaction()
    try {

      await queryInterface.removeColumn('facturacion', 'pay_mode', {
        transaction
      })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
};
