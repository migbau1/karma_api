'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      /** TABLA DE CREDENCIALES */
      await queryInterface.renameTable('userCredentials', 'credenciales', { transaction })
      await queryInterface.addIndex('credenciales', ['email'], { transaction })

      /** TABLA DE ROLES */
      await queryInterface.createTable('roles', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },
        name: Sequelize.STRING,
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      }, { transaction })

      await queryInterface.bulkInsert('roles', [
        {
          id: "20864331-4d42-4e77-b565-d44e90adfef9",
          name: 'admin'
        },
        {
          id: "7a62e6a1-ce40-4a52-8aa7-a7e4c85243ac",
          name: "cliente"
        }
      ], { transaction })

      /** UBICACION */

      await queryInterface.renameTable('ubicacions', 'ubicacion', { transaction })
      await queryInterface.renameColumn('ubicacion', 'codigoPostal', 'cod_postal', { transaction })
      await queryInterface.changeColumn('ubicacion', 'cod_postal', { type: Sequelize.STRING }, { transaction })

      

      await transaction.commit()
    } catch (error) {
      console.log(error);

      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {/** TABLA DE CREDENCIALES */
      await queryInterface.renameTable('credenciales', 'userCredentials', { transaction })

      /** TABLA DE ROLES */
      await queryInterface.dropTable('roles', { transaction })

      /** */
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
};
