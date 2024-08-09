import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export const generateApiKey = () => {
    const prefix = 'sk_irona_';
    const apiKey = crypto.createHash('MD5').update(uuidv4()).digest('hex');
    const currentTime = new Date()
        .toISOString()
        .replace(/[^0-9]/g, '')
        .slice(-3); // Get the last 3 digits of the current timestamp

    return prefix + apiKey + currentTime;
};

export const generateHashedToken = (apiKey: string, salt: string) => {
    const saltedKey = salt + apiKey;
    const hashedKey = crypto
        .createHash('sha256')
        .update(saltedKey)
        .digest('hex');
    return hashedKey;
};
