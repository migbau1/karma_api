declare namespace Express {
    export interface User {
        id?: string;
        rol_id: string;
        nombre: string;
        apellido: string;
        sedeId: string;
    }
}