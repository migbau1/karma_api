interface IProductoCreateDto {
    nombre: string;
    descripcion: string;
    tipo_producto: string;
    cantidad: number
    peso: number
    pesoCob: number
    pesoVol: number
    valorDeclarado: number
}

export default IProductoCreateDto