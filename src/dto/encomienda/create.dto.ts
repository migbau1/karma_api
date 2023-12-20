import IFacturacionCreateDto from "../facturacion/create.dto"
import IProductoCreateDto from "../productos/create.dto"
import IUbicacionDto from "../ubicacion/ubicacion.dto"
import IUserCreateDto from "../user/create.dto"

interface IEncomiendaCreateDto {
    remitente: IUserCreateDto
    destinatario: IUserCreateDto
    origen: IUbicacionDto
    destino: IUbicacionDto
    producto: IProductoCreateDto
    facturacion: IFacturacionCreateDto
    registro: IRegistroEncomiendaDto
    descripcion: string
}

export default IEncomiendaCreateDto