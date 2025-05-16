import { jest, describe, it, expect } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import * as crypto from 'crypto';
import * as uploadService from '../uploadService';

jest.mock('fs', () => ({
  promises: {
    writeFile: jest.fn(),
    unlink: jest.fn(),
    readdir: jest.fn()
  },
  existsSync: jest.fn(),
  mkdirSync: jest.fn()
}));

jest.mock('path', () => ({
  join: jest.fn().mockImplementation((...args) => args.join('/')),
  extname: jest.fn()
}));

jest.mock('crypto', () => ({
  randomUUID: jest.fn()
}));

describe('Upload Service', () => {
  const validJpgBase64 =
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBD...';
  const validPngBase64 =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...';
  const invalidBase64 = 'invalidData';
  const invalidMimeBase64 =
    'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MK...';

  beforeEach(() => {
    jest.clearAllMocks();
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (crypto.randomUUID as jest.Mock).mockReturnValue('test-uuid');
  });

  describe('saveBase64Image', () => {
    it('should successfully save a valid jpeg image', async () => {
      const buffer = Buffer.from('test-image-data');
      jest.spyOn(Buffer, 'from').mockReturnValueOnce(buffer);
      (fs.promises.writeFile as jest.Mock).mockResolvedValue(
        undefined as never
      );
      (path.extname as jest.Mock).mockReturnValue('.jpg');

      const result = await uploadService.saveBase64Image(
        validJpgBase64,
        'image.jpg'
      );

      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('test-uuid.jpg'),
        buffer
      );
      expect(result).toEqual({
        fileName: 'test-uuid.jpg',
        filePath: expect.stringContaining('test-uuid.jpg'),
        fileUrl: '/uploads/test-uuid.jpg',
        fileSize: buffer.length
      });
    });

    it('should successfully save a valid png image', async () => {
      const buffer = Buffer.from('png-data');
      jest.spyOn(Buffer, 'from').mockReturnValueOnce(buffer);
      (fs.promises.writeFile as jest.Mock).mockResolvedValue(
        undefined as never
      );
      (path.extname as jest.Mock).mockReturnValue('.png');

      const result = await uploadService.saveBase64Image(
        validPngBase64,
        'image.png'
      );

      expect(result).toEqual({
        fileName: 'test-uuid.png',
        filePath: expect.stringContaining('test-uuid.png'),
        fileUrl: '/uploads/test-uuid.png',
        fileSize: buffer.length
      });
    });

    it('should return error for invalid base64 format', async () => {
      const result = await uploadService.saveBase64Image(
        invalidBase64,
        'image.jpg'
      );

      expect(fs.promises.writeFile).not.toHaveBeenCalled();
      expect(result).toEqual({ error: 'Invalid Base64 data format' });
    });

    it('should return error for disallowed mime type', async () => {
      const result = await uploadService.saveBase64Image(
        invalidMimeBase64,
        'document.pdf'
      );

      expect(fs.promises.writeFile).not.toHaveBeenCalled();
      expect(result).toEqual({
        error:
          'File type not allowed. Only JPEG, PNG, GIF and WebP images are accepted.'
      });
    });

    it('should return error for file exceeding size limit', async () => {
      const largeBuffer = { length: 6 * 1024 * 1024 };
      jest.spyOn(Buffer, 'from').mockReturnValueOnce(largeBuffer as never);

      const result = await uploadService.saveBase64Image(
        validJpgBase64,
        'large-image.jpg'
      );

      expect(fs.promises.writeFile).not.toHaveBeenCalled();
      expect(result).toEqual({
        error: 'File too large. Maximum allowed size is 5MB.'
      });
    });

    it('should handle errors during file saving', async () => {
      const buffer = Buffer.from('test-image-data');
      jest.spyOn(Buffer, 'from').mockReturnValueOnce(buffer);
      (fs.promises.writeFile as jest.Mock).mockRejectedValue(
        new Error('Write error') as never
      );

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const result = await uploadService.saveBase64Image(
        validJpgBase64,
        'image.jpg'
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error saving image:',
        expect.any(Error)
      );
      expect(result).toEqual({ error: 'Error processing and saving image' });

      consoleSpy.mockRestore();
    });
  });

  describe('deleteImage', () => {
    it('should successfully delete an existing image', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.unlink as jest.Mock).mockResolvedValue(undefined as never);

      const result = await uploadService.deleteImage('existing-image.jpg');

      expect(path.join).toHaveBeenCalledWith(
        expect.stringContaining('uploads'),
        'existing-image.jpg'
      );
      expect(fs.promises.unlink).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false when image does not exist', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      const result = await uploadService.deleteImage('nonexistent.jpg');

      expect(fs.promises.unlink).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should handle errors during image deletion', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.unlink as jest.Mock).mockRejectedValue(
        new Error('Deletion error') as never
      );

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const result = await uploadService.deleteImage('problem-image.jpg');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error deleting image:',
        expect.any(Error)
      );
      expect(result).toBe(false);

      consoleSpy.mockRestore();
    });
  });

  describe('listImages', () => {
    it('should list all images in the uploads directory', async () => {
      const mockFiles = ['image1.jpg', 'image2.png', 'image3.webp'];
      (fs.promises.readdir as jest.Mock).mockResolvedValue(mockFiles as never);

      const result = await uploadService.listImages();

      expect(fs.promises.readdir).toHaveBeenCalled();
      expect(result).toEqual([
        { fileName: 'image1.jpg', fileUrl: '/uploads/image1.jpg' },
        { fileName: 'image2.png', fileUrl: '/uploads/image2.png' },
        { fileName: 'image3.webp', fileUrl: '/uploads/image3.webp' }
      ]);
    });

    it('should return an empty array when directory is empty', async () => {
      (fs.promises.readdir as jest.Mock).mockResolvedValue([] as never);

      const result = await uploadService.listImages();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle errors during listing images', async () => {
      (fs.promises.readdir as jest.Mock).mockRejectedValue(
        new Error('Read error') as never
      );

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const result = await uploadService.listImages();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error listing images:',
        expect.any(Error)
      );
      expect(result).toEqual([]);

      consoleSpy.mockRestore();
    });
  });
});
