import { z } from 'zod';

export default z.object({
  CEP: z.string(),
  estado: z.string(),
  cidade: z.string(),
  bairro: z.string(),
  rua: z.string(),
  numero: z.string(),
  complemento: z.string().optional()
});
