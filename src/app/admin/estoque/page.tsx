'use client';
import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputComponent from '@/components/InputComponent';
import { ProductCard, ImageUploader } from '@/components';
import { IProduct } from '@/interfaces';
import LoadingProducts from './loading';
import trpc from '@/trpc/client/trpc';
import { productSchema } from '@/trpc/schemas';
import { useToast } from '@/contexts';

export default function StockManager() {
  const {
    register,
    handleSubmit,
    reset,
    trigger,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<IProduct>({
    resolver: zodResolver(productSchema),
    mode: 'onChange',
    defaultValues: {
      imagem: [],
      nomeImagem: []
    }
  });

  const { showToast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<File[]>([]);
  const imageUrls = watch('imagem');

  const {
    data: products,
    isLoading: isLoadingProducts,
    refetch
  } = trpc.products.getAll.useQuery();

  const { mutateAsync: uploadImage } = trpc.upload.uploadImage.useMutation({
    onSuccess: (data) => {
      setValue('imagem', [...imageUrls, data.fileUrl]);
      setValue('nomeImagem', [...watch('nomeImagem'), data.fileName]);
      trigger(['imagem', 'nomeImagem']);

      // Process next queued file if any
      if (uploadQueue.length > 0) {
        const nextFile = uploadQueue[0];
        setUploadQueue((prev) => prev.slice(1));
        processFileUpload(nextFile);
      } else {
        setIsUploading(false);
        showToast('Imagens carregadas com sucesso!', 'success');
      }
    },
    onError: (error) => {
      showToast(error.message, 'error');
      setIsUploading(false);
    }
  });

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const processFileUpload = useCallback(
    async (file: File) => {
      try {
        const base64Data = await convertFileToBase64(file);
        await uploadImage({
          base64Data,
          fileName: file.name
        });
      } catch {
        setIsUploading(false);
        showToast('Erro ao processar imagem', 'error');
      }
    },
    [showToast, uploadImage]
  );

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);

    if (uploadQueue.length === 0) {
      await processFileUpload(file);
    } else {
      setUploadQueue((prev) => [...prev, file]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setValue(
      'imagem',
      imageUrls.filter((_, i) => i !== index)
    );
    setValue(
      'nomeImagem',
      watch('nomeImagem').filter((_, i) => i !== index)
    );
    trigger(['imagem', 'nomeImagem']);
  };

  const { mutateAsync: saveProduct } = trpc.products.save.useMutation({
    onSuccess() {
      reset({
        imagem: [],
        nomeImagem: []
      });
      refetch();
      showToast('Estoque atualizado com sucesso!', 'success');
    },
    onError(error) {
      showToast(error.message, 'error');
    }
  });

  const { mutate: deleteProduct } = trpc.products.delete.useMutation({
    onSuccess() {
      refetch();
      showToast('Produto removido com sucesso!', 'success');
    },
    onError(error) {
      showToast(error.message, 'error');
    }
  });

  const editProduct = (id: string) => {
    const product = products?.find((prod) => prod._id === id);
    if (product) {
      reset(product);
      trigger();
    }
  };

  const fields = [
    { name: 'nome', label: 'Nome', type: 'text' },
    { name: 'categoria', label: 'Categoria', type: 'text' },
    { name: 'preco', label: 'Preço', type: 'number' },
    { name: 'quantidade', label: 'Quantidade', type: 'number' },
    { name: 'descricao', label: 'Descrição', type: 'text' }
  ];

  useEffect(() => {
    if (uploadQueue.length > 0 && !isUploading) {
      setIsUploading(true);
      const nextFile = uploadQueue[0];
      setUploadQueue((prev) => prev.slice(1));
      processFileUpload(nextFile);
    }
  }, [isUploading, processFileUpload, uploadQueue]);

  return (
    <main className="flex flex-col pt-16">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-center pb-2">
          Gerenciador de Estoque
        </h1>
        <div className="border-2 border-white md:w-1/12 w-1/2 mb-5"></div>
      </div>
      <div className="flex min-h-screen flex-col md:flex-row items-center justify-around">
        <form onSubmit={handleSubmit((data) => saveProduct(data))}>
          <div className="flex flex-col items-start p-5 gap-5">
            <div className="w-full">
              <label className="label">
                <span className="label-text text-xl">Imagens do Produto</span>
              </label>
              <ImageUploader
                onFileSelect={handleFileSelect}
                previewUrls={imageUrls}
                className="mb-4"
                onRemoveImage={handleRemoveImage}
              />
              {(errors.imagem || errors.nomeImagem) && (
                <p className="text-error py-2">
                  {errors.imagem?.message || errors.nomeImagem?.message}
                </p>
              )}
            </div>

            <input type="hidden" {...register('imagem')} />
            <input type="hidden" {...register('nomeImagem')} />

            {fields.map(({ name, label, type }) => (
              <div key={name} className="w-full">
                <InputComponent
                  label={label}
                  name={name}
                  type={type}
                  placeholder={`Digite ${label.toLowerCase()}`}
                  register={register}
                />
                {errors[name as keyof IProduct] && (
                  <p className="text-error py-2">
                    {errors[name as keyof IProduct]?.message}
                  </p>
                )}
              </div>
            ))}

            <button
              type="submit"
              className={`text-xl btn ${(!isValid || isUploading) && 'btn-disabled'}`}
              disabled={!isValid || isUploading}
            >
              {isUploading ? 'Enviando imagens...' : 'Registrar'}
            </button>
          </div>
        </form>

        <div
          id="products_container"
          className="grid grid-col-1 gap-5 justify-center md:justify-normal md:w-96 w-full overflow-y-scroll overflow-x-hidden min-w-80 md:min-w-fit max-h-screen border-2 border-white rounded-lg p-10"
        >
          {isLoadingProducts ? (
            <LoadingProducts />
          ) : (
            products?.map((product) => (
              <div
                key={product._id}
                className="bg-base-300 py-2 rounded-box flex flex-col items-center justify-center gap-2"
              >
                <ProductCard
                  imagePath={product.imagem[0] || ''}
                  imageAlt={product.nomeImagem[0] || product.nome}
                  productTitle={product.nome}
                  productDescription={product.descricao}
                  productPrice={product.preco.toString()}
                  id={product._id!}
                />
                {product.imagem.length > 1 && (
                  <div className="text-xs text-center mb-2">
                    Este produto possui {product.imagem.length} imagens
                  </div>
                )}
                <div className="flex flex-row gap-5 mb-10 md:mb-0">
                  <button
                    onClick={() => editProduct(product._id!)}
                    className="btn btn-accent"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteProduct(product._id!)}
                    className="btn btn-error"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
