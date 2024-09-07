import axios from 'axios';
import { Request, Response } from 'express';
import fs from 'fs';
import FormData from 'form-data';
import { IncomingForm, File } from 'formidable';

const WHATSAPP_ID = process.env.WHATSAPP_ID;
const token = process.env.TOKEN_WHATSAPP;

if (!WHATSAPP_ID || !token) {
    throw new Error('El servicio de WhatsApp está deshabilitado debido a la falta de configuración del ID o del token');
}

const BASE_URL = `https://graph.facebook.com/v20.0/${WHATSAPP_ID}`;
const MESSAGE_URL = `${BASE_URL}/messages`;
const MEDIA_URL = `${BASE_URL}/media`;

const config = {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
};

async function sendMessage(req: Request, res: Response) {
    const { to } = req.body;

    const data = {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
            name: 'hello_world',
            language: { code: 'en_US' }
        }
    };

    try {
        const response = await axios.post(MESSAGE_URL, data, config);
        res.json(response.data);
    } catch (error) {
        handleAxiosError(error, res);
    }
}

async function uploadDocument(fileBuffer: Buffer, filename: string) {
    const form = new FormData();
    form.append('file', fileBuffer, filename);
    form.append('messaging_product', 'whatsapp');

    const configWithFormHeaders = {
        headers: {
            ...form.getHeaders(),
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const response = await axios.post(MEDIA_URL, form, configWithFormHeaders);
        return response.data;
    } catch (error) {
        console.error('Error uploading document:', error);
        throw error;
    }
}

async function sendDocument(req: Request, res: Response) {
    const { to } = req.body;

    // Validar que req.file es un array y tiene al menos un archivo
    if (!req.file || !Array.isArray(req.file) || req.file.length === 0) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.file[0] as File;

    try {
        const fileBuffer = fs.readFileSync(file.filepath);
        const uploadResponse = await uploadDocument(fileBuffer, file.originalFilename || 'uploaded-document.xlsx');
        const mediaId = uploadResponse.id;

        // Iterar sobre el array de números de teléfono y enviar el documento a cada uno
        const sendPromises = to.map(async (phoneNumber: string) => {
            const data = {
                messaging_product: 'whatsapp',
                to: phoneNumber,
                type: 'template',
                template: {
                    name: 'send_guide',
                    language: { code: 'es' },
                    components: [{
                        type: 'header',
                        parameters: [{
                            type: 'document',
                            document: {
                                id: mediaId,
                                filename: file.originalFilename || 'uploaded-document.pdf'
                            }
                        }]
                    }]
                }
            };

            return axios.post(MESSAGE_URL, data, config);
        });

        // Esperar a que todas las solicitudes se completen
        const responses = await Promise.all(sendPromises);

        // Enviar la respuesta con los resultados de todas las solicitudes
        res.json(responses.map(response => response.data));
    } catch (error) {
        handleAxiosError(error, res);
    }
}

async function parseFormData(req: Request, res: Response, next: () => void) {
    try {
        const form = new IncomingForm();

        const { fields, files } = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) {
                    return reject(err);
                }
                resolve({ fields, files });
            });
        });

        req.body = fields;
        req.file = files.file; // Assuming there is only one file
        next();
    } catch (err) {
        res.status(400).json({ message: 'Error parsing form data' });
    }
}

function handleAxiosError(error: any, res: Response) {
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

export {
    sendMessage,
    sendDocument,
    parseFormData
};
