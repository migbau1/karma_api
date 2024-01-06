declare namespace Express {
    export interface User {
        id?: string;
        rol_name: string;
        rol_id: string;
        nombre: string;
        apellido: string;
        email: string;
        sedeId: string;
    }
}