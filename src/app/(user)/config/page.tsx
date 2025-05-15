'use client';
import { getCookie } from 'cookies-next/client';
import trpc from '@/trpc/client/trpc';
import { IAddress } from '@/interfaces';
import {
  PersonalDataForm,
  PasswordChangeForm,
  AddressManagement
} from './components';
import { useToast } from '@/contexts';

export default function UserConfiguration() {
  const userId = getCookie('user_session');
  const { data, refetch } = trpc.customers.getById.useQuery(userId as string, {
    enabled: !!userId
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

  const updatePassword = async (passwords: {
    current: string;
    new: string;
    confirm: string;
  }) => {
    const isPasswordValid =
      passwords.new &&
      passwords.new !== passwords.current &&
      passwords.new === passwords.confirm;

    if (isPasswordValid) {
      try {
        await saveUserData({ ...data!, senha: passwords.new });
        showToast('Senha atualizada com sucesso!', 'success');
        return true;
      } catch {
        showToast('Erro ao atualizar senha', 'error');
        return false;
      }
    } else {
      showToast('Senhas não conferem ou inválidas', 'error');
      return false;
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
          email: data?.email || ''
        }}
        onSave={updatePersonalData}
      />

      <PasswordChangeForm
        currentPassword={data?.senha || ''}
        onSave={updatePassword}
      />

      <AddressManagement address={data?.endereco} onSave={saveAddress} />
    </main>
  );
}
