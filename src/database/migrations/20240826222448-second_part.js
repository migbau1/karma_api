'use strict';

const { v4: uuidv4 } = require('uuid')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {

      // Eliminar la restricción de clave foránea en 'ubicacionId' antes de renombrar la columna
      await queryInterface.removeConstraint('usuarios', 'usuarios_ibfk_1', { transaction }); // Ajusta el nombre de la restricción según sea necesario
      await queryInterface.removeIndex('usuarios', 'ubicacionId', { transaction })
      /** TABLA USUARIOS */

      await queryInterface.removeColumn('usuarios', 'rol', { transaction })
      await queryInterface.addColumn('usuarios', 'rol_id', {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'roles',
          },
          key: 'id'
        },
        allowNull: false,
        field: 'rol_id',
        defaultValue: '7a62e6a1-ce40-4a52-8aa7-a7e4c85243ac'
      }, { transaction })

      await queryInterface.renameColumn('usuarios', 'ubicacionId', 'ubicacion_id', { transaction })
      await queryInterface.changeColumn('usuarios', 'ubicacion_id', { type: Sequelize.UUID, collate: 'utf8mb4_bin' }, { transaction })
      await queryInterface.addIndex('usuarios', ['ubicacion_id'], { name: 'usuarios_ubi_fk_unique', transaction })
      await queryInterface.addConstraint('usuarios', {
        fields: ['ubicacion_id'],
        type: 'foreign key',
        references: {
          table: 'ubicacion',
          field: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'usuarios_ubi_fk_unique',
        transaction
      })

      await queryInterface.addColumn('usuarios', 'credencial_id', {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'credenciales'
          },
          key: 'id'
        },
        field: 'credencial_id',
        allowNull: true
      }, { transaction })

      /** SEDES */

      await queryInterface.removeConstraint('sedes', 'sedes_ibfk_1', { transaction })
      await queryInterface.removeIndex('sedes', 'ubicacion', { transaction })
      await queryInterface.renameColumn('sedes', 'ubicacion', 'ubicacion_id', { transaction })
      await queryInterface.changeColumn('sedes', 'ubicacion_id', { type: Sequelize.UUID, collate: 'utf8mb4_bin' }, { transaction })
      await queryInterface.addIndex('sedes', ['ubicacion_id'], { name: 'sedes_ubi_fk_unique', transaction })
      await queryInterface.addConstraint('sedes', {
        fields: ['ubicacion_id'],
        type: 'foreign key',
        references: {
          table: 'ubicacion',
          field: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'sedes_ubi_fk_unique',
        transaction
      })

      /**
       * PRODUCTO
       */

      await queryInterface.renameColumn('productos', 'pesoCob', 'peso_cobrar', { transaction })
      await queryInterface.renameColumn('productos', 'pesoVol', 'peso_vol', { transaction })
      await queryInterface.renameColumn('productos', 'valorDeclarado', 'valor_declarado', { transaction })
      await queryInterface.addColumn('productos', 'tipo_producto', {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'tipo_producto'
      }, { transaction })

      // Actualiza todos los registros de la tabla 'productos' en una sola consulta
      await queryInterface.sequelize.query(
        "UPDATE productos SET nombre = CONCAT(nombre, ' con ', descripcion)",
        { transaction }
      );


      /** USUARIOS SEDES */

      await queryInterface.createTable('usuario_sedes', {
        usuario: {
          type: Sequelize.UUID,
          references: {
            model: {
              tableName: 'usuarios'
            },
            key: 'id'
          },
          allowNull: false, primaryKey: true,
          field: 'usuario_id'
        },
        sede: {
          type: Sequelize.UUID,
          references: {
            model: {
              tableName: 'sedes'
            },
            key: 'id'
          }, allowNull: false, primaryKey: true,
          field: 'sede_id'
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      }, { transaction })

      /** REGISTROS ENCOMIENDAS */

      await queryInterface.createTable('registro_encomiendas', {
        id: {
          type: Sequelize.UUID, primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },
        sedeId: {
          type: Sequelize.UUID,
          references: {
            model: {
              tableName: 'sedes'
            },
            key: 'id'
          },
          allowNull: false,
          field: 'sede_id'
        },
        usuario_id: {
          type: Sequelize.UUID,
          references: {
            model: {
              tableName: 'usuarios'
            },
            key: 'id'
          },
          allowNull: false,
          field: 'usuario_id'
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      }, { transaction })

      /** FACTURACION */

      await queryInterface.createTable('facturacion', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },
        encomienda: {
          type: Sequelize.BIGINT,
          allowNull: false,
          field: 'encomienda_id',
          unique: true
        },
        valorSeguro: {
          type: Sequelize.DOUBLE,
          field: 'valor_seguro'
        },
        valorFlete: {
          type: Sequelize.DOUBLE,
          field: 'valor_flete'
        },
        otrosCobros: {
          type: Sequelize.DOUBLE,
          field: 'otros_cobros'
        },
        recargos: Sequelize.DOUBLE,
        descuentos: Sequelize.DOUBLE,
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      }, { transaction })


      await queryInterface.addIndex('facturacion', ['encomienda_id'], { name: 'facturacion_encomienda_fk_unique', transaction })
      await queryInterface.addConstraint('facturacion', {
        fields: ['encomienda_id'],
        type: 'foreign key',
        references: {
          table: 'encomiendas',
          field: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'facturacion_encomienda_fk_unique',
        transaction
      })

      await queryInterface.addColumn('facturacion', 'pay_mode', {
        type: Sequelize.STRING,
        defaultValue: "Contado",
        transaction
      })

      /** ENCOMIENDAS */
      const [encomiendas] = await queryInterface.sequelize.query('SELECT * FROM encomiendas', { transaction });

      if (encomiendas.length > 0) {
        const facturaciones = encomiendas.map((it) => ({
          id: uuidv4(),
          encomienda_id: it.id,
          valor_seguro: it.valorSeguro,
          valor_flete: it.valorFlete,
          otros_cobros: it.otrosCobros,
          recargos: it.recargos,
          descuentos: it.descuentos,
          pay_mode: it.formaPago,
          createdAt: it.createdAt,
          updatedAt: it.updatedAt
        }));

        await queryInterface.bulkInsert('facturacion', facturaciones, { transaction });
      }

      await queryInterface.removeConstraint('encomiendas', 'encomiendas_ibfk_7', { transaction }); // Ajusta el nombre de la restricción según sea necesario
      await queryInterface.removeIndex('encomiendas', 'remitenteId', { transaction })
      await queryInterface.renameColumn('encomiendas', 'remitenteId', 'remitente_id', { transaction })
      await queryInterface.changeColumn('encomiendas', 'remitente_id', { type: Sequelize.UUID, collate: 'utf8mb4_bin' }, { transaction })
      await queryInterface.removeConstraint('encomiendas', 'encomiendas_ibfk_8', { transaction }); // Ajusta el nombre de la restricción según sea necesario
      await queryInterface.removeIndex('encomiendas', 'destinatarioId', { transaction })
      await queryInterface.renameColumn('encomiendas', 'destinatarioId', 'destinatario_id', { transaction })
      await queryInterface.changeColumn('encomiendas', 'destinatario_id', { type: Sequelize.UUID, collate: 'utf8mb4_bin' }, { transaction })
      await queryInterface.removeConstraint('encomiendas', 'encomiendas_ibfk_9', { transaction }); // Ajusta el nombre de la restricción según sea necesario
      await queryInterface.removeIndex('encomiendas', 'origenId', { transaction })
      await queryInterface.renameColumn('encomiendas', 'origenId', 'origen_id', { transaction })
      await queryInterface.changeColumn('encomiendas', 'origen_id', { type: Sequelize.UUID, collate: 'utf8mb4_bin' }, { transaction })
      await queryInterface.removeConstraint('encomiendas', 'encomiendas_ibfk_10', { transaction }); // Ajusta el nombre de la restricción según sea necesario
      await queryInterface.removeIndex('encomiendas', 'destinoId', { transaction })
      await queryInterface.renameColumn('encomiendas', 'destinoId', 'destino_id', { transaction })
      await queryInterface.changeColumn('encomiendas', 'destino_id', { type: Sequelize.UUID, collate: 'utf8mb4_bin' }, { transaction })
      await queryInterface.removeConstraint('encomiendas', 'encomiendas_ibfk_11', { transaction }); // Ajusta el nombre de la restricción según sea necesario
      await queryInterface.removeIndex('encomiendas', 'productoId', { transaction })
      await queryInterface.renameColumn('encomiendas', 'productoId', 'producto_id', { transaction })
      await queryInterface.changeColumn('encomiendas', 'producto_id', { type: Sequelize.UUID, collate: 'utf8mb4_bin' }, { transaction })

      await queryInterface.addIndex('encomiendas', ['remitente_id'], { name: 'encomiendas_ibfk_7', transaction })
      await queryInterface.addConstraint('encomiendas', {
        fields: ['remitente_id'],
        type: 'foreign key',
        references: {
          table: 'usuarios',
          field: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'encomiendas_ibfk_7',
        transaction,
      })
      await queryInterface.addIndex('encomiendas', ['destinatario_id'], { name: 'encomiendas_ibfk_8', transaction })
      await queryInterface.addConstraint('encomiendas', {
        fields: ['destinatario_id'],
        type: 'foreign key',
        references: {
          table: 'usuarios',
          field: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'encomiendas_ibfk_8',
        transaction
      })
      await queryInterface.addIndex('encomiendas', ['origen_id'], { name: 'encomiendas_ibfk_9', transaction })
      await queryInterface.addConstraint('encomiendas', {
        fields: ['origen_id'],
        type: 'foreign key',
        references: {
          table: 'ubicacion',
          field: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'encomiendas_ibfk_9',
        transaction
      })
      await queryInterface.addIndex('encomiendas', ['destino_id'], { name: 'encomiendas_ibfk_10', transaction })
      await queryInterface.addConstraint('encomiendas', {
        fields: ['destino_id'],
        type: 'foreign key',
        references: {
          table: 'ubicacion',
          field: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'encomiendas_ibfk_10',
        transaction
      })
      await queryInterface.addIndex('encomiendas', ['producto_id'], { name: 'encomiendas_ibfk_11', transaction })
      await queryInterface.addConstraint('encomiendas', {
        fields: ['producto_id'],
        type: 'foreign key',
        references: {
          table: 'productos',
          field: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'encomiendas_ibfk_11',
        transaction
      })

      await queryInterface.addColumn('encomiendas', 'registro_id', {
        type: Sequelize.UUID,
        references: {
          model: 'registro_encomiendas',
          key: 'id'
        },
        allowNull: true,
        field: 'registro_id'
      }, { transaction })

      await queryInterface.removeColumn('encomiendas', 'sedeId', { transaction })
      await queryInterface.removeColumn('encomiendas', 'tipoProducto', { transaction })
      await queryInterface.removeColumn('encomiendas', 'valorSeguro', { transaction })
      await queryInterface.removeColumn('encomiendas', 'otrosCobros', { transaction })
      await queryInterface.removeColumn('encomiendas', 'valorFlete', { transaction })
      await queryInterface.removeColumn('encomiendas', 'recargos', { transaction })
      await queryInterface.removeColumn('encomiendas', 'descuento', { transaction })
      await queryInterface.removeColumn('encomiendas', 'formaPago', { transaction })


      await transaction.commit()
    } catch (error) {
      console.log(error);

      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
};
