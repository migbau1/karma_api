import { Request, Response, ErrorRequestHandler } from "express"
import sequelize from '../database/connection'
import moment from "moment"
import { ModelCtor, Op, Sequelize } from "sequelize"
import { IEncomiendaModel } from "../database/models/Encomienda"

moment.locale('es', {
    weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_')
})

const weekArray = moment.localeData().weekdays()

const encomiendaModel = sequelize.model('encomiendas') as ModelCtor<IEncomiendaModel>

const generatedGuides = async (request: Request<any, any, {
    from: Date, to: Date
}>, response: Response) => {
    try {
        const { from, to } = request.body
        const startDate = moment(from);
        const endDate = moment(to);

        // Generar un array con todos los días en el rango especificado
        const daysInRange = [];
        for (let m = startDate; m.isSameOrBefore(endDate); m.add(1, 'days')) {
            daysInRange.push({
                dia: m.format('dddd'),
                date: m.format('YYYY-MM-DD') // Fecha en formato YYYY-MM-DD
            });
        }

        // Consultar la base de datos para contar las encomiendas creadas por día
        const encomiendas = await encomiendaModel.findAll({
            attributes: [
                [Sequelize.fn('DATE', Sequelize.col('createdAt')), 'day'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
            ],
            where: {
                createdAt: {
                    [Op.between]: [new Date(from), new Date(to)]
                }
            },
            group: [Sequelize.fn('DATE', Sequelize.col('createdAt'))],
            order: [[Sequelize.fn('DATE', Sequelize.col('createdAt')), 'ASC']]
        });

        // Transformar los resultados para el frontend
        const countsByDay = daysInRange.map((dayInfo) => {
            const encomienda = encomiendas.find(e => {
                // Asegurarse de que `day` es una cadena de fecha
                const day = e.get('day') as string;
                return moment(day).format('YYYY-MM-DD') === dayInfo.date;
            });
            const count = encomienda ? encomienda.get('count') as number : 0;
            return {
                dia: dayInfo.dia,
                guia: count,
                date: dayInfo.date // Fecha en formato YYYY-MM-DD
            };
        });

        response.status(200).send(countsByDay);

    } catch (error: any) {

        response.status(500).send({
            status: 500,
            msg: error.message || "Ups, un error a ocurrido!"
        })
    }
}

export {
    generatedGuides
}