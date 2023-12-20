import IUbicacionDto from "../ubicacion/ubicacion.dto";

interface ISedeCreateDto {
    nombre: string;
    ubicacion: IUbicacionDto
}

export default ISedeCreateDto