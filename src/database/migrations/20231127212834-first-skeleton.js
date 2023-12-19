'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    /*
      AQUI SE CREAN LAS TABLAS SIMPLES
    */
    try {
      await queryInterface.createTable('ubicacion', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },
        departamento: Sequelize.STRING,
        municipio: Sequelize.STRING,
        cod_postal: Sequelize.STRING,
        direccion: Sequelize.TEXT,
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      }, { transaction })

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

      await queryInterface.createTable('credenciales', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },
        email: {
          type: Sequelize.STRING(250),
          unique: true,
        },
        password: Sequelize.TEXT,
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      }, { transaction })

      await queryInterface.addIndex('credenciales', ['email'], { transaction })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.dropTable('ubicacion', {
        cascade: true
      }, { transaction })
      await queryInterface.dropTable('roles', {
        cascade: true
      }, { transaction })
      await queryInterface.removeIndex('credenciales', 'email', { transaction })
      await queryInterface.dropTable('credenciales', {
        cascade: true
      }, { transaction })

    } catch (error) {
      transaction.rollback()
      throw error
    }
  }
};
