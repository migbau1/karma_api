// index.d.ts
import { File } from 'formidable';

declare global {
    namespace Express {
        interface User {
            id?: string;
            rol_name: string;
            rol_id: string;
            nombre: string;
            apellido: string;
            email: string;
            sedeId: string;
        }

        interface Request {
            file: File[];
        }
    }
}

export {}; // Esto convierte el archivo en un módulo y evita problemas de declaraciones duplicadas.
