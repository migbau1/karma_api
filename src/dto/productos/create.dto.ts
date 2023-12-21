interface IProductoCreateDto {
    nombre: string;
    descripcion: string;
    tipo_producto: string;
    cantidad: number
    peso: number
    peso_cobrar: number
    peso_vol: number
    valor_declarado: number
}

export default IProductoCreateDto