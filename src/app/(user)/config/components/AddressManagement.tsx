import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IAddress } from '@/interfaces';
import { object, string, optional, pipe, minLength } from 'valibot'

interface AddressManagementProps {
  address?: IAddress;
  onSave: (address: IAddress) => Promise<boolean>;
}

const addressSchema = object({
  CEP: pipe(string(), minLength(1, 'CEP é obrigatório')),
  estado: pipe(string(), minLength(2, 'Estado precisa ter pelo menos 2 caracteres')),
  cidade: pipe(string(), minLength(3, 'Cidade precisa ter pelo menos 3 caracteres')),
  bairro: pipe(string(), minLength(3, 'Bairro precisa ter pelo menos 3 caracteres')),
  rua: pipe(string(), minLength(3, 'Rua precisa ter pelo menos 3 caracteres')),
  numero: pipe(string(), minLength(1, 'Número é obrigatório')),
  complemento: optional(string()),
})

export default function AddressManagement({
  address,
  onSave
}: AddressManagementProps) {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const hasAddress = !!address?.rua;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<IAddress>({
    resolver: zodResolver(addressSchema),
    defaultValues: address || {
      CEP: '',
      estado: '',
      cidade: '',
      bairro: '',
      rua: '',
      numero: '',
      complemento: ''
    }
  });

  useEffect(() => {
    if (address) {
      reset(address);
    }
  }, [address, reset]);

  const handleSaveAddress = async (formData: IAddress) => {
    const success = await onSave(formData);
    if (success) {
      setShowAddressForm(false);
    }
  };

  return (
    <section className="card card-body card-bordered shadow-md mb-5 w-full md:w-1/2">
      <h2 className="card-title">Gerenciamento de Endereços</h2>
      <div className="flex flex-col gap-2">
        {hasAddress && address && (
          <div className="bg-base-200 p-4 rounded-lg">
            <h3 className="font-medium mb-1">Endereço atual:</h3>
            <p>
              {address.rua}, {address.numero}
              {address.complemento && ` - ${address.complemento}`}
            </p>
            <p>
              {address.bairro}, {address.cidade} - {address.estado}
            </p>
            <p>CEP: {address.CEP}</p>
          </div>
        )}

        <button
          onClick={() => setShowAddressForm(!showAddressForm)}
          className={`btn ${hasAddress ? 'btn-natural' : 'btn-secondary'} mt-2`}
          aria-expanded={showAddressForm}
          aria-controls="address-form"
        >
          {hasAddress ? 'Editar Endereço' : 'Adicionar Endereço'}
        </button>
      </div>

      {showAddressForm && (
        <form
          id="address-form"
          onSubmit={handleSubmit(handleSaveAddress)}
          className="mt-4 border-t pt-4"
        >
          {[
            { name: 'CEP', label: 'CEP' },
            { name: 'estado', label: 'Estado' },
            { name: 'cidade', label: 'Cidade' },
            { name: 'bairro', label: 'Bairro' },
            { name: 'rua', label: 'Rua' },
            { name: 'numero', label: 'Número' },
            { name: 'complemento', label: 'Complemento' }
          ].map((field) => (
            <div key={field.name} className="flex flex-col gap-2 mb-2">
              <label htmlFor={field.name} className="label">
                {field.label}
              </label>
              <input
                id={field.name}
                type={field.name === 'numero' ? 'number' : 'text'}
                placeholder={`Digite ${field.label.toLowerCase()}`}
                className="input input-bordered focus-within:ring-white focus-within:ring-2 w-full"
                {...register(field.name as keyof IAddress)}
                aria-invalid={!!errors[field.name as keyof IAddress]}
              />
              {errors[field.name as keyof IAddress] && (
                <p className="text-error text-sm mt-1">
                  {errors[field.name as keyof IAddress]?.message}
                </p>
              )}
            </div>
          ))}
          <button type="submit" className="btn btn-success text-white mt-3">
            Salvar endereço
          </button>
        </form>
      )}
    </section>
  );
}
