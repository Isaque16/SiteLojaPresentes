export default interface IAddress {
  CEP: string;
  estado: string;
  bairro: string;
  rua: string;
  numero: string;
  complemento?: string;
}
