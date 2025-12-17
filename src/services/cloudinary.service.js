// services/cloudinary.service.js
import config from './cloudinary.config.json';

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${config.cloudName}/raw/upload`;

/**
 * Upload a file to Cloudinary (raw type, eg PDF)
 * @param {File} file
 * @returns {Promise<{url:string, publicId:string}>}
 */
export async function uploadToCloudinary(file) {
    if (!file) {
        throw new Error('No file provided');
    }

    if (file.size > 10 * 1024 * 1024) {
        throw new Error('File exceeds 10MB limit');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', config.uploadPreset);
    if (config.folder) {
        formData.append('folder', config.folder);
    }

    const res = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Cloudinary upload failed: ${err}`);
    }

    const data = await res.json();

    return {
        url: data.secure_url,
        publicId: data.public_id
    };
}
