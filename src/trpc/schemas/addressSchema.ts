import { object, string, optional } from 'valibot';

export default object({
  CEP: string(),
  estado: string(),
  cidade: string(),
  bairro: string(),
  rua: string(),
  numero: string(),
  complemento: optional(string())
});
