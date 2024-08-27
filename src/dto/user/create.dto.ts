import IUbicacionDto from "../ubicacion/ubicacion.dto";

interface IUserCreateDto {
    nombre: string;
    apellido: string
    cedula: string
    telefono: string
    rol?: string
    ubicacion?: IUbicacionDto
    roleId?: string
}

export default IUserCreateDto