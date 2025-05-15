import { z } from 'zod';
import addressSchema from './addressSchema';

export default z.object({
  _id: z.string().optional(),
  nomeCompleto: z.string(),
  nomeUsuario: z.string(),
  senha: z.string(),
  email: z.string().email(),
  telefone: z.string(),
  endereco: addressSchema.optional()
});
