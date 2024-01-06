'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.createTable('usuarios', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },
        nombre: Sequelize.STRING,
        apellido: Sequelize.STRING,
        cedula: {
          type: Sequelize.STRING,
          unique: true,
        },
        telefono: Sequelize.STRING,
        rolId: {
          type: Sequelize.UUID,
          references: {
            model: {
              tableName: 'roles',
            },
            key: 'id'
          },
          allowNull: false,
          field: 'rol_id'
        },
        ubicacionId: {
          type: Sequelize.UUID,
          references: {
            model: {
              tableName: 'ubicacion'
            },
            key: 'id'
          },
          allowNull: true,
          field: 'ubicacion_id'
        },
        credencialId: {
          type: Sequelize.UUID,
          references: {
            model: {
              tableName: 'credenciales'
            },
            key: 'id'
          },
          field: 'credencial_id'
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      }, { transaction })
      
      await queryInterface.addIndex('usuarios', ['cedula'], { transaction })

      await queryInterface.createTable('sedes', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },
        nombre: {
          type: Sequelize.STRING,
          unique: true,
        },
        ubicacionId: {
          type: Sequelize.UUID,
          references: {
            model: {
              tableName: 'ubicacion'
            },
            key: 'id'
          },
          allowNull: true,
          field: 'ubicacion_id'
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      }, { transaction })

      await queryInterface.addIndex('sedes', ['nombre'], { transaction })

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

      /**
       * Aqui se crean las entidades de Productos, Encomienda y Billing o facturacion
       */

      await queryInterface.createTable('productos', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },
        nombre: Sequelize.STRING,
        descripcion: Sequelize.STRING,
        tipoProducto: {
          type: Sequelize.STRING,
          field: 'tipo_producto'
        },
        cantidad: {
          type: Sequelize.DOUBLE,
          allowNull: false,
          defaultValue: 0
        },
        peso: Sequelize.DOUBLE,
        pesoCobrar: {
          type: Sequelize.DOUBLE,
          field: 'peso_cobrar'
        },
        pesoVol: {
          type: Sequelize.DOUBLE,
          field: 'peso_vol'
        },
        valorDeclarado: {
          type: Sequelize.DOUBLE,
          field: 'valor_declarado'
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      }, { transaction })

      await queryInterface.createTable('encomiendas', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        remitente: {
          type: Sequelize.UUID,
          references: {
            model: {
              tableName: 'usuarios'
            },
            key: 'id'
          },
          allowNull: false,
          field: 'remitente_id'
        },
        destinatario: {
          type: Sequelize.UUID,
          references: {
            model: {
              tableName: 'usuarios'
            },
            key: 'id'
          },
          allowNull: false,
          field: 'destinatario_id'
        },
        origen: {
          type: Sequelize.UUID,
          references: {
            model: {
              tableName: 'ubicacion'
            },
            key: 'id'
          },
          allowNull: false,
          field: 'origen_id'
        },
        destino: {
          type: Sequelize.UUID,
          references: {
            model: {
              tableName: 'ubicacion'
            },
            key: 'id'
          },
          allowNull: false,
          field: 'destino_id'
        },
        producto: {
          type: Sequelize.UUID,
          references: {
            model: {
              tableName: 'productos'
            },
            key: 'id',
          },
          allowNull: false,
          field: 'producto_id'
        },
        registro: {
          type: Sequelize.UUID,
          references: {
            model: {
              tableName: 'registro_encomiendas'
            },
            key: 'id',
            allowNull: false,
          },
          field: 'registro_id'
        },
        descripcion: Sequelize.STRING,
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      }, { transaction })

      await queryInterface.createTable('facturacion', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },
        encomienda: {
          type: Sequelize.INTEGER,
          references: {
            model: {
              tableName: 'encomiendas'
            },
            key: 'id',
          },
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

      
      await queryInterface.addIndex('facturacion', ['encomienda_id'], { transaction })

      /**
       * Relacion entre sede y usuario
       */

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

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.dropTable('facturacion', {
        cascade: true
      }, { transaction })
      await queryInterface.dropTable('encomiendas', {
        cascade: true
      }, { transaction })
      await queryInterface.dropTable('productos', {
        cascade: true
      }, { transaction })
      await queryInterface.dropTable('usuario_sedes', {
        cascade: true
      }, { transaction })
      await queryInterface.dropTable('registro_encomiendas', {
        cascade: true
      }, { transaction })
      await queryInterface.dropTable('sedes', {
        cascade: true
      }, { transaction })
      await queryInterface.dropTable('usuarios', {
        cascade: true
      }, { transaction })
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
};
