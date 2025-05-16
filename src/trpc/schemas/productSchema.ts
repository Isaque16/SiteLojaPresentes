import { z } from 'zod';

export default z.object({
  _id: z.string().optional().readonly(),
  nome: z.string().min(3, 'O nome precisa ter pelo menos 3 caracteres'),
  categoria: z
    .string()
    .min(3, 'A categoria precisa ter pelo menos 3 caracteres'),
  preco: z
    .string()
    .transform((val) => Number(val))
    .or(z.number().min(1, 'O preço deve ser maior que 0')),
  quantidade: z
    .string()
    .transform((val) => Number(val))
    .or(z.number().min(1, 'Deve haver ao menos 1 produto')),
  descricao: z.string(),
  imagem: z.array(z.string()).min(1, 'Pelo menos uma imagem é necessária'),
  nomeImagem: z.array(z.string()).min(1, 'Nome de imagem é obrigatório')
});
