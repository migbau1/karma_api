import path from "path";
import Excel from 'exceljs'
import { v4 } from "uuid";
import { Request, Response } from "express";
import sequelize from "../database/connection";
import { InferAttributes, ModelCtor, Op, WhereOptions } from "sequelize";
import { IEncomiendaModel } from "../database/models/Encomienda";
import { IUserModel } from "../database/models/Usuarios";
import { IUbicationModel } from "../database/models/Ubicacion";
import { IProductoModel } from "../database/models/Producto";
import { IFacturacionModel } from "../database/models/Facturacion";


const encomiendaModel = sequelize.model('encomiendas') as ModelCtor<IEncomiendaModel>
const usuarioModel = sequelize.model('usuarios') as ModelCtor<IUserModel>
const ubicacionModel = sequelize.model('ubicacion') as ModelCtor<IUbicationModel>
const productoModel = sequelize.model('productos') as ModelCtor<IProductoModel>
const facturacionModel = sequelize.model('facturacion') as ModelCtor<IFacturacionModel>

async function exportGuias(req: Request, res: Response) {
    const { dateRange } = req.body as { dateRange: [string, string] };
    const remitente = "";


    const where: WhereOptions<InferAttributes<IEncomiendaModel, { omit: never; }>> = {
        createdAt: {
            [Op.between]: [
                dateRange[0], dateRange[1]
            ],
        },
    };

    if (remitente !== "") {
        where.remitente_id = remitente;
    }
    try {
        const guia = await encomiendaModel.findAll({
            include: [
                {
                    model: usuarioModel,
                    as: "destinatario",
                    attributes: {
                        exclude: ["id", "createdAt", "updatedAt", "ubicacionId"],
                    },
                    order: ["createdAt"],
                },
                {
                    model: usuarioModel,
                    as: "remitente",
                    attributes: {
                        exclude: ["id", "createdAt", "updatedAt", "ubicacionId"],
                    },
                },
                {
                    model: ubicacionModel,
                    as: "origen",
                    attributes: {
                        exclude: ["id", "createdAt", "updatedAt"],
                    },
                },
                {
                    model: ubicacionModel,
                    as: "destino",
                    attributes: {
                        exclude: ["id", "createdAt", "updatedAt"],
                    },
                },
                {
                    model: productoModel,
                    as: "producto",
                    attributes: {
                        exclude: ["id", "createdAt", "updatedAt"],
                    },
                },
                {
                    model: facturacionModel,
                    as: "facturacion",
                    attributes: {
                        exclude: ["id", "createdAt", "updatedAt"],
                    },
                },
            ],
            where: where,
            attributes: {
                exclude: [
                    "updatedAt",
                    "sedeId",
                    "productoId",
                    "destinoId",
                    "origenId",
                    "destinatarioId",
                    "remitenteId",
                ],
            },
        });

        const columns = [
            {
                header: "Numero guia",
                style: {
                    font: {
                        name: "Arial",
                    },
                },
            },
            {
                header: "Valor Flete",
                width: 15,
                style: {
                    numFmt: "$#,##0.00;[Red]-$#,##0.00",
                    font: {
                        name: "Arial",
                    },
                },
            },
            {
                header: "Valor Seguro",
                width: 15,
                style: {
                    numFmt: "$#,##0.00;[Red]-$#,##0.00",
                },
            },
            {
                header: "Recargos",
                width: 10,
                style: {
                    numFmt: "$#,##0.00;[Red]-$#,##0.00",
                },
            },
            {
                header: "Otros Cobros",
                width: 10,
                style: {
                    numFmt: "$#,##0.00;[Red]-$#,##0.00",
                },
            },
            {
                header: "Descuentos",
                width: 10,
                style: {
                    numFmt: "$#,##0.00;[Red]-$#,##0.00",
                },
            },
            {
                header: "Forma de pago",
                width: 15,
                style: {
                    font: {
                        name: "Arial",
                    },
                },
            },
            {
                header: "Valor Total",
                width: 15,
                id: "total",
                style: {
                    numFmt: "$#,##0.00;[Red]-$#,##0.00",
                },
            },
            {
                header: "Remitente",
                width: 20,
                style: {
                    font: {
                        name: "Arial",
                    },
                },
            },
            {
                header: "Destinatario",
                width: 20,
                style: {
                    font: {
                        name: "Arial",
                    },
                },
            },
            {
                header: "Origen",
                width: 20,
                style: {
                    font: {
                        name: "Arial",
                    },
                },
            },
            {
                header: "Destino",
                width: 20,
                style: {
                    font: {
                        name: "Arial",
                    },
                },
            },
            {
                header: "Producto",
                width: 20,
                style: {
                    font: {
                        name: "Arial",
                    },
                },
            },
            {
                header: "Fecha creado",
                width: 18,
                style: {
                    font: {
                        name: "Arial",
                    },
                },
            },
        ];
        let rows: any = [];

        guia.forEach((element) => {
            const { facturacion, remitente, destinatario, origen, destino, producto } = element

            if (facturacion && remitente && destinatario && origen && destino && producto && element) {

                const total =
                    facturacion.getDataValue("valorFlete") +
                    facturacion.getDataValue("valorSeguro") +
                    facturacion.getDataValue("recargos") +
                    facturacion.getDataValue("otrosCobros");

                rows.push([
                    element.getDataValue("id"),
                    facturacion.getDataValue("valorFlete"),
                    facturacion.getDataValue("valorSeguro"),
                    facturacion.getDataValue("recargos"),
                    facturacion.getDataValue("otrosCobros"),
                    String(facturacion.getDataValue("descuentos")).toLowerCase(),
                    String(facturacion.getDataValue("modoDePago")).toLowerCase(),
                    total,
                    `${remitente.nombre} ${remitente.apellido}`.toLowerCase(),
                    `${destinatario.nombre} ${destinatario.apellido}`.toLowerCase(),
                    `${origen.departamento} - ${origen.municipio} - ${origen.direccion}`.toLowerCase(),
                    `${destino.departamento} - ${destino.municipio} - ${destino.direccion}`.toLowerCase(),
                    String(producto.nombre).toLowerCase(),
                    new Date(element.createdAt!).toLocaleDateString("es-CO")
                ]);
            }
        });

        const r = await createXls(columns, rows, dateRange[0], dateRange[1], "GUIAS");
        res.writeHead(200, [
            [
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ],
        ]);
        res.end(r);
    } catch (error: any) {
        console.error(error);
        res.status(500).send(error)
    }
}

async function exportUsers(req: Request, res: Response) {
    const { dateRange } = req.body as { dateRange: [string, string] };
    const where = {
        createdAt: {
            [Op.between]: [
                dateRange[0], dateRange[1]
            ],
        },
    };

    try {
        const users = await usuarioModel.findAll({
            include: ubicacionModel,
            where,
        });
        const columns = [
            {
                header: "Nombre",
                width: 25,
                outlineLevel: 1,
                key: "name",
                style: {
                    font: {
                        name: "Arial",
                    },
                },
            },
            {
                header: "Cedula",
                width: 12,
                key: "cedula",
                style: {
                    font: {
                        name: "Arial",
                    },
                },
            },
            {
                header: "Telefono",
                width: 12,
                key: "telefono",
                style: {
                    font: {
                        name: "Arial",
                    },
                },
            },
            {
                header: "Departamento",
                width: 25,
                key: "departamento",
                style: {
                    font: {
                        name: "Arial",
                    },
                },
            },
            {
                header: "Municipio",
                width: 17,
                key: "municipio",
                style: {
                    font: {
                        name: "Arial",
                    },
                },
            },
            {
                header: "Direccion",
                width: 35,
                key: "direccion",
                style: {
                    font: {
                        name: "Arial",
                    },
                },
            },
        ];
        let rows: any[] = [];

        users.forEach((element: any) => {
            rows.push([
                `${element.getDataValue("nombre")} ${element.getDataValue(
                    "apellido"
                )}`.toLowerCase() || " NO ACTUALIZADO ",
                element.getDataValue("cedula") || " NO ACTUALIZADO ",
                element.getDataValue("telefono") || " NO ACTUALIZADO ",
                String(element.ubicacion?.departamento).toLowerCase() !== "undefined"
                    ? String(element.ubicacion?.departamento).toLowerCase()
                    : " NO ACTUALIZADO ",
                String(element.ubicacion?.municipio).toLowerCase() !== "undefined"
                    ? String(element.ubicacion?.municipio).toLowerCase()
                    : " NO ACTUALIZADO ",
                String(element.ubicacion?.direccion).toLowerCase() !== "undefined"
                    ? String(element.ubicacion?.direccion).toLowerCase()
                    : " NO ACTUALIZADO ",
            ]);
        });
        const r = await createXls(columns, rows, dateRange[0], dateRange[1], "USUARIOS");
        res.writeHead(200, [
            [
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ],
        ]);
        res.end(r);
    } catch (error: any) {
        console.error(error);
        res.send({
            name: error.name,
            type: error.parent.routine,
            message: "ups, an error has occurred",
        });
    }
}

async function createXls(columns: any, data: any, desde: any, hasta: any, nombre: any): Promise<Excel.Buffer> {
    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet("guias");

    ws.columns = columns;

    ws.addRows(data);
    ws.insertRow(1, [
        `${nombre} GENERAD@S DESDE ${desde} HASTA ${hasta}`,
    ]).commit();
    ws.getCell("A1").alignment = {
        horizontal: "center",
    };
    if (nombre === "GUIAS") {
        ws.mergeCells("A1:N1");
        ws.autoFilter = "A2:N2";
    } else {
        ws.mergeCells("A1:F1");
        ws.autoFilter = "A2:F2";
    }

    ws.eachRow({ includeEmpty: true }, (row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
            if (rowNumber === 1) {
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "ff0000" },
                };
                cell.font = {
                    color: { argb: "ffffff" },
                };
            }
            if (rowNumber == 2) {
                // First set the background of header row
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "f5b914" },
                };
            }
            if (nombre == "GUIAS" && colNumber === 8 && rowNumber > 2) {
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFFFFF00" },
                };
            }
            // Set border of each cell
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        });
        //Commit the changed row to the stream
        row.commit();
    });
    const wbbuf = await wb.xlsx.writeBuffer({
        filename: path.resolve(__dirname, `../templates/${v4().toString()}.xlsx`),
    });

    return wbbuf;
}

export {
    exportGuias,
    exportUsers
};
