import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useToast } from '@/contexts';

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  onSuccess?: (fileUrl: string) => void;
  onError?: (message: string) => void;
  previewUrls?: string[];
  className?: string;
  onRemoveImage?: (index: number) => void;
}

export default function ImageUploader({
  onFileSelect,
  onError,
  previewUrls: initialPreviewUrls,
  className = '',
  onRemoveImage
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>(
    initialPreviewUrls || []
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (initialPreviewUrls) {
      setPreviewUrls(initialPreviewUrls);
    }
  }, [initialPreviewUrls]);

  const createPreview = useCallback((file: File): string => {
    return URL.createObjectURL(file);
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
      const previewUrl = createPreview(file);
      setPreviewUrls((prevUrls) => [...prevUrls, previewUrl]);
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
        Array.from(e.dataTransfer.files).forEach((file) => {
          processFile(file);
        });
      }
    },
    [processFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        Array.from(e.target.files).forEach((file) => {
          processFile(file);
        });
      }
    },
    [processFile]
  );

  const handleRemoveImage = useCallback(
    (e: React.MouseEvent, index: number) => {
      e.stopPropagation();

      setPreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));

      if (onRemoveImage) {
        onRemoveImage(index);
      }
    },
    [onRemoveImage]
  );

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
          multiple
        />

        {previewUrls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Imagem ${index + 1}`}
                  className="mx-auto max-h-48 rounded-md object-contain"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity rounded-md">
                  <button
                    type="button"
                    onClick={(e) => handleRemoveImage(e, index)}
                    className="btn btn-error btn-sm"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-center border-2 border-dashed border-base-content/30 rounded-md min-h-32">
              <div className="text-center p-4">
                <p className="text-primary">Adicionar mais imagens</p>
              </div>
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
              Arraste e solte uma ou várias imagens aqui ou
            </p>
            <p className="mt-1">
              <span className="text-primary font-semibold">
                clique para selecionar
              </span>
            </p>
            <p className="mt-2 text-xs text-base-content/60">
              JPG, PNG ou WEBP (máx. 5MB por arquivo)
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
