import Excel from 'exceljs'
import moment from 'moment-timezone'
import { Request, Response } from 'express'
import sequelize from '../database/connection'
import { FindOptions, InferAttributes, ModelCtor } from 'sequelize'
import { IEncomiendaModel } from '../database/models/Encomienda'
import { defaultIncludes } from '../controller/encomienda.controller'
import path from 'path'
import { ISedeModel } from '../database/models/Sede'
import { v4 } from 'uuid'

import bwipjs from 'bwip-js';
import fs from 'fs';
import Jimp from 'jimp';

const encomiendaModel = sequelize.model('encomiendas') as ModelCtor<IEncomiendaModel>
const sedeModel = sequelize.model('sedes') as ModelCtor<ISedeModel>

const wb = new Excel.Workbook()

async function exportEncomienda(req: Request, res: Response) {

    const code = v4();
    const transaction = await sequelize.transaction()
    const tmpId = req.params.id

    const workbook = await wb.xlsx.readFile(
        path.resolve(__dirname, "../templates/TEMPLATE_BYA.xlsx")
    );
    let ws = workbook.getWorksheet("hoja1")!;

    // Genera código de barras como imagen utilizando bwip-js
    const barcodeBuffer = await bwipjs.toBuffer({
        bcid: 'code128',
        text: code,
        scale: 3,
        height: 15,
        includetext: true,
        textxalign: 'center',
    });

    // Ruta del directorio temp
    const tempDir = path.resolve(__dirname, "../temp");

    // Verifica si el directorio existe, y si no, lo crea
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    // Ahora puedes continuar con la creación del archivo
    const barcodeFilePath = path.join(tempDir, "barcode.png");
    fs.writeFileSync(barcodeFilePath, barcodeBuffer);

    const resizedBarcodePath = path.join(tempDir, "barcode_resized.png");
    const barcodeImage = await Jimp.read(barcodeFilePath);
    barcodeImage.resize(700, 150); // Ajusta el tamaño según tus necesidades
    await barcodeImage.writeAsync(resizedBarcodePath);

    // Agrega el código de barras a la hoja de Excel
    const imageId = workbook.addImage({
        filename: resizedBarcodePath,
        extension: 'png',
    });

    const options: FindOptions<InferAttributes<IEncomiendaModel, { omit: never; }>> = {
        attributes: ['id', 'descripcion'],
        include: [
            ...defaultIncludes()
        ],
        transaction
    }

    let fecha

    const coldate = moment().tz("America/Bogota");

    if (fecha !== undefined) {
        fecha = {
            date: new Date(fecha).toLocaleDateString("es-CO"),
            hora: new Date(fecha).getHours() + ":" + new Date(fecha).getMinutes(),
        };
        console.log("fecha1:  ", fecha);
    } else {
        fecha = {
            date: coldate.toDate(),
            hora: coldate.hour() + ":" + coldate.minute(),
        };
    }

    try {
        const tmpEncomienda = await encomiendaModel.findByPk(tmpId, options)
        const tmpSede = await sedeModel.findByPk(req.user?.sedeId, { transaction })

        if (!tmpEncomienda) {
            return res.status(404).json({
                message: 'Not Found'
            })
        }

        const {
            remitente,
            destinatario,
            origen,
            destino,
            producto,
            registro,
            facturacion,
            descripcion,
            sede,
            id } = tmpEncomienda


        /**
         * Apartado de Informacion de la empresa - HEADER
         */
        ws.getRow(2).getCell(8).value = "EMPRESA DE SERVICIOS LOGISTICA Y TRANSPORTE DE CARGA B&A SAS"
        ws.getRow(3).getCell(8).value = "NIT. 900.544.631-7"
        ws.getRow(4).getCell(8).value = "Carrera 23# 19- 14, san francisco"
        ws.getRow(5).getCell(8).value = "ATENCION AL CLIENTE:  3206461453"
        //codigoDebarras
        // ws.getRow(3).getCell(12).value = code;

        ws.addImage(imageId, {
            tl: { col: 11, row: 2 }, // Ajusta la posición según tus necesidades
            ext: { width: 300, height: 60 }, // Ajusta el tamaño según tus necesidades
        });
        //consecutivo
        ws.getRow(3).getCell(23).value = id || "XXXX";
        //=======================================================
        ws.getRow(28).getCell(8).value = "EMPRESA DE SERVICIOS LOGISTICA Y TRANSPORTE DE CARGA B&A SAS"
        ws.getRow(29).getCell(8).value = "NIT. 900.544.631-7"
        ws.getRow(30).getCell(8).value = "Carrera 23# 19- 14, san francisco"
        ws.getRow(31).getCell(8).value = "ATENCION AL CLIENTE:  3206461453"
        //codigoDebarras
        // ws.getRow(29).getCell(12).value = code;
        ws.addImage(imageId, {
            tl: { col: 11, row: 28 }, // Ajusta la posición según tus necesidades
            ext: { width: 300, height: 60 }, // Ajusta el tamaño según tus necesidades
        });
        //consecutivo
        ws.getRow(29).getCell(23).value = id || "XXXX";
        //=======================================================
        ws.getRow(54).getCell(8).value = "EMPRESA DE SERVICIOS LOGISTICA Y TRANSPORTE DE CARGA B&A SAS"
        ws.getRow(55).getCell(8).value = "NIT. 900.544.631-7"
        ws.getRow(56).getCell(8).value = "Carrera 23# 19- 14, san francisco"
        ws.getRow(57).getCell(8).value = "ATENCION AL CLIENTE:  3206461453"
        //codigoDebarras
        // ws.getRow(55).getCell(12).value = code;
        ws.addImage(imageId, {
            tl: { col: 11, row: 54 }, // Ajusta la posición según tus necesidades
            ext: { width: 300, height: 60 }, // Ajusta el tamaño según tus necesidades
        });
        //consecutivo
        ws.getRow(55).getCell(23).value = id || "XXXX";


        if (remitente) {
            /**
             * Acá van todas las celdas con información del remitente, para las tres guias
             */

            //  Remitente Nombre
            ws.getRow(8).getCell(2).value = (`Remite: ${remitente.nombre} ${remitente.apellido}`).toUpperCase();
            ws.getRow(12).getCell(4).value = remitente.telefono
            ws.getRow(12).getCell(6).value = remitente.cedula
            //  Remitente Nombre
            ws.getRow(34).getCell(2).value = (`Remite: ${remitente.nombre} ${remitente.apellido}`).toUpperCase();
            ws.getRow(38).getCell(4).value = remitente.telefono
            ws.getRow(38).getCell(6).value = remitente.cedula
            //  Remitente Nombre
            ws.getRow(60).getCell(2).value = (`Remite: ${remitente.nombre} ${remitente.apellido}`).toUpperCase();
            ws.getRow(64).getCell(4).value = remitente.telefono
            ws.getRow(64).getCell(6).value = remitente.cedula
        }

        if (destinatario) {
            /**
             * Acá van todas las celdas con información del remitente, para las tres guias
             */

            //  Remitente Nombre
            ws.getRow(8).getCell(8).value = (`Destinatario: ${destinatario.nombre} ${destinatario.apellido}`).toUpperCase();
            ws.getRow(12).getCell(10).value = destinatario.telefono
            ws.getRow(12).getCell(12).value = destinatario.cedula
            //  Remitente Nombre
            ws.getRow(34).getCell(8).value = (`Destinatario: ${destinatario.nombre} ${destinatario.apellido}`).toUpperCase();
            ws.getRow(38).getCell(10).value = destinatario.telefono
            ws.getRow(38).getCell(12).value = destinatario.cedula
            //  Remitente Nombre
            ws.getRow(60).getCell(8).value = (`Destinatario: ${destinatario.nombre} ${destinatario.apellido}`).toUpperCase();
            ws.getRow(64).getCell(10).value = destinatario.telefono
            ws.getRow(64).getCell(12).value = destinatario.cedula
        }

        if (origen) {
            //direccion origen
            ws.getRow(10).getCell(2).value = origen.direccion;
            //Origen municipio
            ws.getRow(13).getCell(4).value = origen.municipio;
            //Departamento Origen
            ws.getRow(15).getCell(4).value = origen.departamento;
            //codigo postal origen
            ws.getRow(17).getCell(4).value = origen.codigoPostal;
            //Factura 2 =====================================================================================
            //direccion origen
            ws.getRow(36).getCell(2).value = origen.direccion;
            //Origen municipio
            ws.getRow(39).getCell(4).value = origen.municipio;
            //Departamento Origen
            ws.getRow(41).getCell(4).value = origen.departamento;
            //codigo postal origen
            ws.getRow(43).getCell(4).value = origen.codigoPostal;
            //Factura 3 =====================================================================================
            //direccion origen
            ws.getRow(62).getCell(2).value = origen.direccion;
            //Origen municipio
            ws.getRow(65).getCell(4).value = origen.municipio;
            //Departamento Origen
            ws.getRow(67).getCell(4).value = origen.departamento;
            //codigo postal origen
            ws.getRow(69).getCell(4).value = origen.codigoPostal;
        }

        if (destino) {
            //direccion destino
            ws.getRow(10).getCell(8).value = destino.direccion;
            //Destino municipio
            ws.getRow(13).getCell(10).value = destino.municipio;
            //Departamento Destino
            ws.getRow(15).getCell(10).value = destino.departamento;
            //Codigo postal destino
            ws.getRow(17).getCell(10).value = destino.codigoPostal;
            //Factura 2 =======================================================================================
            //direccion destino
            ws.getRow(36).getCell(8).value = destino.direccion;
            //Destino municipio
            ws.getRow(39).getCell(10).value = destino.municipio;
            //Departamento Destino
            ws.getRow(41).getCell(10).value = destino.departamento;
            //Codigo postal destino
            ws.getRow(43).getCell(10).value = destino.codigoPostal;
            //Factura 3 =======================================================================================
            //direccion destino
            ws.getRow(62).getCell(8).value = destino.direccion;
            //Destino municipio
            ws.getRow(65).getCell(10).value = destino.municipio;
            //Departamento Destino
            ws.getRow(67).getCell(10).value = destino.departamento;
            //Codigo postal destino
            ws.getRow(69).getCell(10).value = destino.codigoPostal;
        }

        if (producto) {
            // //producto
            ws.getRow(7).getCell(4).value = "Paqueteo";
            //Piezas
            ws.getRow(9).getCell(24).value = producto.cantidad;
            //Peso total
            ws.getRow(12).getCell(18).value = String(producto.peso);
            //Valor declarado producto
            ws.getRow(13).getCell(18).value = producto.valorDeclarado;
            // Factura 2 ========================================================================================
            //producto
            ws.getRow(33).getCell(4).value = "Paqueteo";
            //Piezas
            ws.getRow(35).getCell(24).value = producto.cantidad;
            //Peso total
            ws.getRow(38).getCell(18).value = producto.peso;
            //Valor declarado producto
            ws.getRow(39).getCell(18).value = producto.valorDeclarado;
            // Factura 3 ========================================================================================
            //producto
            ws.getRow(59).getCell(4).value = "Paqueteo";
            //Piezas
            ws.getRow(61).getCell(24).value = producto.cantidad;
            //Peso total
            ws.getRow(64).getCell(18).value = producto.peso;
            //Valor declarado producto
            ws.getRow(65).getCell(18).value = producto.valorDeclarado;

            //==============================================================
            //peso cob
            ws.getRow(10).getCell(24).value = String(producto.pesoCob);
            //peso vol
            ws.getRow(11).getCell(24).value = String(producto.pesoVol);
            //fecha admision
            ws.getRow(6).getCell(24).value = fecha.date;
            //Hora Admision
            ws.getRow(7).getCell(24).value = fecha.hora;
            //Mod. Transporte
            ws.getRow(8).getCell(18).value = "Terrestre";
            // //Observaciones generales

            //peso cob
            ws.getRow(36).getCell(24).value = String(producto.pesoCob);
            //peso vol
            ws.getRow(37).getCell(24).value = String(producto.pesoVol);

            //==============================================================
            //peso cob
            ws.getRow(62).getCell(24).value = String(producto.pesoCob);
            //peso vol
            ws.getRow(63).getCell(24).value = String(producto.pesoVol);


            ws.getRow(17).getCell(18).value = (producto.nombre).toUpperCase();
            ws.getRow(43).getCell(18).value = (producto.nombre).toUpperCase();
            ws.getRow(69).getCell(18).value = (producto.nombre).toUpperCase();
        }

        if (tmpSede) {
            //punto Servicio
            ws.getRow(6).getCell(5).value = tmpSede.nombre;
            //generado por
            ws.getRow(6).getCell(11).value = req.user?.nombre || '';
            //punto Servicio
            ws.getRow(32).getCell(5).value = tmpSede.nombre;
            //generado por
            ws.getRow(32).getCell(11).value = req.user?.nombre || '';
            //punto Servicio
            ws.getRow(58).getCell(5).value = tmpSede.nombre;
            //generado por
            ws.getRow(58).getCell(11).value = req.user?.nombre || '';
        }

        if (facturacion) {
            const total = facturacion.valorFlete + facturacion.otrosCobros + facturacion.valorSeguro + facturacion.recargos - facturacion.descuentos
            //Valor seguro
            ws.getRow(12).getCell(24).value = facturacion.valorSeguro;
            //Otros cobros
            ws.getRow(13).getCell(24).value = facturacion.otrosCobros;
            //Valor Flete
            ws.getRow(14).getCell(18).value = facturacion.valorFlete;
            //Recargos
            ws.getRow(14).getCell(24).value = facturacion.recargos;
            //Valor descuento
            ws.getRow(15).getCell(24).value = facturacion.descuentos;
            //Valor a cobrar
            ws.getRow(16).getCell(24).value = total;
            //Forma de pago
            ws.getRow(7).getCell(11).value = facturacion.modoDePago;

            ws.getRow(19).getCell(2).value = descripcion;
            //==============================================================

            //Valor seguro
            ws.getRow(38).getCell(24).value = facturacion.valorSeguro;
            //Otros cobros
            ws.getRow(39).getCell(24).value = facturacion.otrosCobros;
            //Valor Flete
            ws.getRow(40).getCell(18).value = facturacion.valorFlete;
            //Recargos
            ws.getRow(40).getCell(24).value = facturacion.recargos;
            //Valor descuento
            ws.getRow(41).getCell(24).value = facturacion.descuentos;
            //Valor a cobrar
            ws.getRow(42).getCell(24).value = total;
            //Forma de pago
            ws.getRow(33).getCell(11).value = facturacion.modoDePago;
            //fecha admision
            ws.getRow(32).getCell(24).value = fecha.date;
            //Hora Admision
            ws.getRow(33).getCell(24).value = fecha.hora;
            //Mod. Transporte
            ws.getRow(34).getCell(18).value = "Terrestre";
            //Observaciones generales
            ws.getRow(45).getCell(2).value = descripcion;

            //Forma de pago
            ws.getRow(59).getCell(11).value = facturacion.modoDePago;
            //Valor seguro
            ws.getRow(64).getCell(24).value = facturacion.valorSeguro;
            //Otros cobros
            ws.getRow(65).getCell(24).value = facturacion.otrosCobros;
            //Valor Flete
            ws.getRow(66).getCell(18).value = facturacion.valorFlete;
            //Recargos
            ws.getRow(66).getCell(24).value = facturacion.recargos;
            //Valor descuento
            ws.getRow(67).getCell(24).value = facturacion.descuentos;
            //fecha admision
            ws.getRow(58).getCell(24).value = fecha.date;
            //Hora Admision
            ws.getRow(59).getCell(24).value = fecha.hora;
            //Mod. Transporte
            ws.getRow(60).getCell(18).value = "Terrestre";
            //Observaciones generales
            ws.getRow(71).getCell(2).value = descripcion;
            //Valor a cobrar
            ws.getRow(68).getCell(24).value = total;
        }


        //servicio
        ws.getRow(7).getCell(8).value = "Domicilio";
        ws.getRow(33).getCell(8).value = "Domicilio";
        ws.getRow(59).getCell(8).value = "Domicilio";

        const msg = `El usuario manifiesta que conoce los terminos y condiciones del contrato que encontro publicado en el punto de venta y/o suministro el operador para la lectura, cuyo contenido acepta con la suscripcion de este documento. Para efecto de PQR el usuario podra manifestarlas a traves de las lineas telefonicas de atencion al cliente Tel. 3206461453 o a los correos electronicos transcargabyasas@gmail.com`

        ws.getRow(21).getCell(5).value = msg;
        ws.getRow(47).getCell(5).value = msg;
        ws.getRow(73).getCell(5).value = msg;


        ws.eachRow((row) => row.commit());

        await wb.xlsx.writeFile(
            path.resolve(__dirname, "../templates/TEMPLATEGUIA.xlsx")
        );

        const wbbuf = await wb.xlsx.writeBuffer({
            filename: path.resolve(__dirname, "../templates/TEMPLATEGUIA.xlsx"),
        });
        res.writeHead(200, [
            [
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ],
            [
                "Content-Disposition", "attachment; filename=" + "TEMPLATEGUIA.xlsx"
            ]
        ]);

        await transaction.commit()
        res.end(wbbuf)
    } catch (error) {
        console.log(error);

        await transaction.rollback()
        res.send(error)
    }

}

export default exportEncomienda;
