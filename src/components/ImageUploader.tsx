import React, { useState, useRef, useCallback } from 'react';
import { useToast } from '@/contexts';

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  onSuccess?: (fileUrl: string) => void;
  onError?: (message: string) => void;
  previewUrl?: string;
  className?: string;
}

export default function ImageUploader({
  onFileSelect,
  onError,
  previewUrl: initialPreviewUrl,
  className = ''
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialPreviewUrl || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const createPreview = useCallback((file: File): void => {
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleUpload = useCallback(
    (file: File): void => {
      setIsUploading(true);
      try {
        onFileSelect(file);
        setIsUploading(false);
      } catch (error) {
        setIsUploading(false);
        const errorMsg =
          error instanceof Error ? error.message : 'Erro ao processar arquivo';
        showToast(errorMsg, 'error');
        onError?.(errorMsg);
      }
    },
    [onFileSelect, showToast, onError]
  );

  const processFile = useCallback(
    (file: File): void => {
      createPreview(file);
      handleUpload(file);
    },
    [createPreview, handleUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFile(e.dataTransfer.files[0]);
      }
    },
    [processFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFile(e.target.files[0]);
      }
    },
    [processFile]
  );

  const handleRemoveImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
          isDragging
            ? 'border-primary bg-primary/10'
            : 'border-base-content/30 hover:border-primary'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/webp"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        {previewUrl ? (
          <div className="relative group">
            <img
              src={previewUrl}
              alt="Preview da imagem"
              className="mx-auto max-h-60 rounded-md object-contain"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity rounded-md">
              <button
                type="button"
                onClick={handleRemoveImage}
                className="btn btn-error btn-sm"
              >
                Remover imagem
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="flex justify-center">
              <svg
                className="h-16 w-16 text-base-content/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="mt-4 text-base font-medium text-base-content">
              Arraste e solte uma imagem aqui ou
            </p>
            <p className="mt-1">
              <span className="text-primary font-semibold">
                clique para selecionar
              </span>
            </p>
            <p className="mt-2 text-xs text-base-content/60">
              JPG, PNG ou WEBP (máx. 5MB)
            </p>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-base-100/75 rounded-lg">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-2 font-medium">Enviando...</p>
          </div>
        )}
      </div>
    </div>
  );
}
