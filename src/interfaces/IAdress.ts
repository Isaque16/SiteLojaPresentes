export default interface IAddress {
  CEP: string;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: string;
  complemento?: string;
}
