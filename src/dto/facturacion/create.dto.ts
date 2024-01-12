interface IFacturacionCreateDto {
    encomienda?: string;
    valorSeguro: number
    valorFlete: number
    otrosCobros: number
    recargos: number
    descuentos: number
    modoDePago: string
}

export default IFacturacionCreateDto