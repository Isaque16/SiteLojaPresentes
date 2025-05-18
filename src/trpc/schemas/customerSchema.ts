import { object, optional, pipe, string, readonly, email } from "valibot";
import addressSchema from './addressSchema';

export default object({
  _id: optional(pipe(string(), readonly())),
  nomeCompleto: string(),
  nomeUsuario: string(),
  senha: string(),
  email: pipe(string(), email()),
  telefone: string(),
  endereco: optional(addressSchema)
});
