// Função utilitária para verificar se o nome de usuário já existe
export default async function someUserNames(nome: string): Promise<boolean> {
  const encodedNome = encodeURIComponent(nome);
  try {
    const response = await fetch(`/api/cliente/${encodedNome}`);
    const responseData = await response.json();
    return responseData !== null; // Verifica se o usuário existe
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return false;
  }
}
