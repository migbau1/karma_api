const { models } = require("../database/connection");
const { Op } = require("sequelize");
const path = require("path");
const Excel = require("exceljs");
const { v4 } = require("uuid");
const moment = require("moment-timezone");

async function exportGuias(req, res) {
  const { desde, hasta } = req.body;
  const remitente = "";


  const where = {
    createdAt: {
      [Op.and]: [
        {
          [Op.gte]: desde + " 00:00:00",
        },
        {
          [Op.lte]: hasta + " 23:59:59",
        },
      ],
    },
  };

  if (remitente !== "") {
    where.remitenteId = remitente;
  }
  try {
    const guia = await models.encomienda.findAll({
      include: [
        {
          model: models.usuario,
          as: "destinatario",
          attributes: {
            exclude: ["id", "createdAt", "updatedAt", "ubicacionId"],
          },
          order: ["createdAt"],
        },
        {
          model: models.usuario,
          as: "remitente",
          attributes: {
            exclude: ["id", "createdAt", "updatedAt", "ubicacionId"],
          },
        },
        {
          model: models.ubicacion,
          as: "origen",
          attributes: {
            exclude: ["id", "createdAt", "updatedAt"],
          },
        },
        {
          model: models.ubicacion,
          as: "destino",
          attributes: {
            exclude: ["id", "createdAt", "updatedAt"],
          },
        },
        {
          model: models.producto,
          as: "producto",
          attributes: {
            exclude: ["id", "createdAt", "updatedAt"],
          },
        },
        {
          model: models.sede,
          as: "sede",
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
    let rows = [];

    const coldate = moment().tz("America/Bogota");

    guia.forEach((element) => {
      const total =
        element.getDataValue("valorFlete") +
        element.getDataValue("valorSeguro") +
        element.getDataValue("recargos") +
        element.getDataValue("otrosCobros");

      rows.push([
        element.getDataValue("id"),
        element.getDataValue("valorFlete"),
        element.getDataValue("valorSeguro"),
        element.getDataValue("recargos"),
        element.getDataValue("otrosCobros"),
        String(element.getDataValue("descuento")).toLowerCase(),
        String(element.getDataValue("formaPago")).toLowerCase(),
        total,
        `${element.remitente.nombre} ${element.remitente.apellido}`.toLowerCase(),
        `${element.destinatario.nombre} ${element.destinatario.apellido}`.toLowerCase(),
        `${element.origen.departamento} - ${element.origen.municipio} - ${element.origen.direccion}`.toLowerCase(),
        `${element.destino.departamento} - ${element.destino.municipio} - ${element.destino.direccion}`.toLowerCase(),
        String(element.producto.nombre).toLowerCase(),
        new Date(element.createdAt).toLocaleDateString("es-CO")
      ]);
    });

    const r = await createXls(columns, rows, desde, hasta, "GUIAS");
    res.writeHead(200, [
      [
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ],
    ]);
    res.end(r);
  } catch (error) {
    console.error(error);
    res.send({
      name: error.name,
      type: error.parent.routine,
      message: "ups, an error has occurred",
    });
  }
}

async function exportUsers(req, res) {
  const { desde, hasta } = req.body;
  const where = {
    createdAt: {
      [Op.and]: [
        {
          [Op.gte]: desde,
        },
        {
          [Op.lte]: hasta,
        },
      ],
    },
  };

  try {
    const users = await models.usuario.findAll({
      include: models.ubicacion,
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
    let rows = [];

    users.forEach((element) => {
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
    const r = await createXls(columns, rows, desde, hasta, "USUARIOS");
    res.writeHead(200, [
      [
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ],
    ]);
    res.end(r);
  } catch (error) {
    console.error(error);
    res.send({
      name: error.name,
      type: error.parent.routine,
      message: "ups, an error has occurred",
    });
  }
}

async function createXls(columns, data, desde, hasta, nombre) {
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

  return new Buffer(wbbuf, "base64");
}

module.exports = {
  exportGuias,
  exportUsers,
};
