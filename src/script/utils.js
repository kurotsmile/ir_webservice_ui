import fs from 'fs/promises';
import path from 'path';
import os from 'os';

export const checkAndReadFile = async (filePath) => {
    try {
        await fs.access(filePath);
        const data = await fs.readFile(filePath, 'utf8');
        return data;
    } catch (err) {
        if (err.code === 'ENOENT') {
            return null;
        }
        throw new Error(`Failed to read file at ${filePath}: ${err.message}`);
    }
};

export const readJsonFile = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            throw new Error(`File not found at ${filePath}`);
        }
        if (err instanceof SyntaxError) {
            throw new Error(`Error parsing JSON data from ${filePath}: ${err.message}`);
        }
        throw new Error(`Failed to read file at ${filePath}: ${err.message}`);
    }
};

export const get_file_system = (nameFile) => {
    const dirData = path.join(os.homedir(), 'Data');
    const filePath = path.join(dirData, `${nameFile}.json`);
    return filePath;
};


export const fileExists = async (path) => fs.access(path).then(() => true).catch(() => false);