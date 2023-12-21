import { Request, Response } from "express";
import sequelize from "../../database/connection";
import { ModelCtor } from "sequelize";
import { IUserModel } from "../../database/models/Usuarios";
import { ICredencialesModel } from "../../database/models/Credenciales";
import Roles from "../../utils/roles/roles.pointer";
import { hashPassword } from "../../utils/hash/password.hash";

const usuarios = sequelize.model('usuarios') as ModelCtor<IUserModel>
const credenciales = sequelize.model('credenciales') as ModelCtor<ICredencialesModel>

const registerUser = async (req: Request, res: Response) => {
    const { nombre, apellido, cedula, telefono, email, password } = req.body as RegisterDto
    const transaction = await sequelize.transaction()
    try {

        const createdCredentials = await credenciales.create({
            email,
            password: await hashPassword(password)
        }, { transaction })

        await usuarios.create({
            nombre,
            apellido,
            cedula,
            telefono,
            roleId: Roles.admin,
            credencialId: createdCredentials.getDataValue('id')
        }, { transaction })

        await transaction.commit()
        res.send('Register successful')
    } catch (error) {
        await transaction.rollback()
        console.log(error);
        res.send(error)
    }
}


export {
    registerUser
}