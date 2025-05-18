'use client';
import trpc from '@/trpc/client/trpc';
import { IAddress } from '@/interfaces';
import { PersonalDataForm, AddressManagement } from './components';
import { useAuth, useToast } from "@/contexts";

export default function UserConfiguration() {
  const { user } = useAuth();
  const { data, refetch } = trpc.customers.getById.useQuery(user!.id as string, {
    enabled: !!user!.id
  });
  const { showToast } = useToast();

  const { mutateAsync: saveUserData } = trpc.customers.save.useMutation({
    onSuccess: () => refetch()
  });

  const updatePersonalData = async (userData: {
    username: string;
    email: string;
  }) => {
    try {
      await saveUserData({
        ...data!,
        nomeUsuario: userData.username,
        email: userData.email
      });

      showToast('Dados atualizados com sucesso!', 'success');
    } catch {
      showToast('Erro ao atualizar dados', 'error');
    }
  };

  const saveAddress = async (address: IAddress) => {
    try {
      await saveUserData({ ...data!, endereco: address });
      showToast('Endereço atualizado com sucesso!', 'success');
      return true;
    } catch {
      showToast('Erro ao atualizar endereço', 'error');
      return false;
    }
  };

  return (
    <main className="flex flex-col items-center p-5">
      <header className="flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center pt-10 pb-2">
          Configurações do Perfil
        </h1>
        <div className="border-2 border-white md:w-1/6 w-1/2 mb-5"></div>
      </header>

      <PersonalDataForm
        userData={{
          username: data?.nomeUsuario || '',
          email: data?.email || '',
          telefone: data?.telefone || ''
        }}
        onSave={updatePersonalData}
      />

      <AddressManagement address={data?.endereco} onSave={saveAddress} />
    </main>
  );
}
