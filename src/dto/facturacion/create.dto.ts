interface IFacturacionCreateDto {
    encomienda: string;
    valorSeguro: number
    valorFlete: number
    otrosCobros: number
    recargos: number
    descuentos: number
}

export default IFacturacionCreateDto