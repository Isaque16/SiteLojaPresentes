'use server';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

interface UploadResult {
  fileName: string;
  filePath: string;
  fileUrl: string;
  fileSize: number;
}

interface UploadErrorResult {
  error: string;
}

/**
 * Saves a Base64 encoded image to the file system
 *
 * @param {string} base64Data - String containing Base64 image data
 * @param {string} originalFileName - Original file name
 * @returns {Promise<UploadResult | UploadErrorResult>} Upload result or error
 */
export async function saveBase64Image(
  base64Data: string,
  originalFileName: string
): Promise<UploadResult | UploadErrorResult> {
  try {
    // Extract MIME type and data from Base64
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
      return { error: 'Invalid Base64 data format' };
    }

    const mimeType = matches[1];
    const base64 = matches[2];
    const buffer = Buffer.from(base64, 'base64');

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return {
        error:
          'File type not allowed. Only JPEG, PNG, GIF and WebP images are accepted.'
      };
    }

    if (buffer.length > MAX_FILE_SIZE) {
      return {
        error: 'File too large. Maximum allowed size is 5MB.'
      };
    }

    const fileExtension =
      path.extname(originalFileName) ||
      (mimeType === 'image/jpeg'
        ? '.jpg'
        : mimeType === 'image/png'
          ? '.png'
          : mimeType === 'image/gif'
            ? '.gif'
            : '.webp');

    // Generate a unique file name
    const uniqueFileName = randomUUID() + fileExtension;
    const filePath = path.join(UPLOAD_DIR, uniqueFileName);

    // Save the file
    await fs.promises.writeFile(filePath, buffer);

    return {
      fileName: uniqueFileName,
      filePath: filePath,
      fileUrl: `/uploads/${uniqueFileName}`,
      fileSize: buffer.length
    };
  } catch (error) {
    console.error('Error saving image:', error);
    return { error: 'Error processing and saving image' };
  }
}

/**
 * Deletes an image from the file system
 *
 * @param {string} fileName - Name of the file to be deleted
 * @returns {Promise<boolean>} true if the file was successfully deleted, false otherwise
 */
export async function deleteImage(fileName: string): Promise<boolean> {
  try {
    const filePath = path.join(UPLOAD_DIR, fileName);

    if (!fs.existsSync(filePath)) {
      return false;
    }

    await fs.promises.unlink(filePath);
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

/**
 * Lists all available images in the uploads directory
 *
 * @returns {Promise<Array<{ fileName: string; fileUrl: string }>>} Array containing name and URL of each image
 */
export async function listImages(): Promise<
  Array<{ fileName: string; fileUrl: string }>
> {
  try {
    const files = await fs.promises.readdir(UPLOAD_DIR);
    return files.map((fileName) => ({
      fileName,
      fileUrl: `/uploads/${fileName}`
    }));
  } catch (error) {
    console.error('Error listing images:', error);
    return [];
  }
}
