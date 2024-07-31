import axios from 'axios';
import { Request, Response } from 'express';
import fs from 'fs'
import FormData from 'form-data';
import path from 'path';
import { IncomingForm, File } from 'formidable'
const url = 'https://graph.facebook.com/v20.0/308265089046877/messages';
const mediaUrl = 'https://graph.facebook.com/v20.0/308265089046877/media';
const token = process.env.TOKEN_WHATSAPP;

async function sendMessage(req: Request, res: Response) {
    const { to, msg } = req.body;

    const data = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'template',
        template: {
            name: 'hello_world',
            language: {
                code: 'en_US'
            }
        }
    };

    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        console.log('Request data:', data);
        console.log('Request headers:', config);

        const response = await axios.post(url, data, config);
        console.log('Response data:', response.data);
        res.json(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error response data:', error.response?.data);
            res.status(error.response?.status || 500).json({
                message: error.message,
                data: error.response?.data
            });
        } else {
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'Unexpected error occurred' });
        }
    }
}

// Función para subir el documento a WhatsApp
async function uploadDocument(fileBuffer: Buffer, filename: string) {

    const form = new FormData();
    form.append('file', fileBuffer, filename);
    form.append('messaging_product', 'whatsapp');

    const config = {
        headers: {
            ...form.getHeaders(),
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const response = await axios.post(mediaUrl, form, config);
        return response.data; // Debería incluir media_id
    } catch (error) {
        console.error('Error uploading document:', error);
        throw error;
    }
}

async function sendDocument(req: any, res: Response) {
    const { to } = req.body;
    const file = req.file[0] as File;

    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        // Paso 1: Subir el documento y obtener media_id
        const fileBuffer = fs.readFileSync(file.filepath); // Leer el archivo desde el path temporal
        
        const uploadResponse = await uploadDocument(fileBuffer, file.originalFilename || 'uploaded-document.xlsx');
        const mediaId = uploadResponse.id;

        // Paso 2: Enviar el documento usando media_id con la plantilla 'send_guide' en español
        const data = {
            messaging_product: 'whatsapp',
            to: to,
            type: 'template',
            template: {
                name: 'send_guide', // Nombre de la plantilla
                language: {
                    code: 'es' // Código de idioma para español
                },
                components: [
                    {
                        type: 'header',
                        parameters: [
                            {
                                type: 'document',
                                document: {
                                    id: mediaId, // ID del documento subido
                                    filename: file.originalFilename || 'uploaded-document.xlsx'
                                }
                            }
                        ]
                    }
                ]
            }
        };

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        const response = await axios.post(url, data, config);
        res.json(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            res.status(error.response?.status || 500).json({
                message: error.message,
                data: error.response?.data
            });
        } else {
            console.log(error);
            
            res.status(500).json({ message: 'Unexpected error occurred' });
        }
    }
}

// Middleware para procesar `form-data`
function parseFormData(req: any, res: Response, next: () => void) {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({ message: 'Error parsing form data' });
        }
        req.body = fields;
        req.file = files.file; // Asumiendo que hay un solo archivo
        next();
    });
}


export {
    sendMessage,
    sendDocument,
    parseFormData
}
