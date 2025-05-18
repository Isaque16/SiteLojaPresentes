import * as v from 'valibot';

export default v.object({
  _id: v.optional(v.pipe(v.string(), v.readonly())),
  nome: v.pipe(v.string(), v.minLength(3, 'O nome precisa ter pelo menos 3 caracteres')),
  categoria: v.pipe(v.string(), v.minLength(3, 'A categoria precisa ter pelo menos 3 caracteres')),
  preco: v.union([
    v.pipe(v.string(), v.transform(val => Number(val))),
    v.pipe(v.number(), v.minValue(1, 'O preço deve ser maior que 0'))
  ]),
  quantidade: v.union([
    v.pipe(v.string(), v.transform(val => Number(val))),
    v.pipe(v.number(), v.minValue(1, 'Deve haver ao menos 1 produto'))
  ]),
  descricao: v.string(),
  imagem: v.array(v.pipe(v.string(), v.minLength(1, 'Pelo menos uma imagem é necessária'))),
  nomeImagem: v.array(v.pipe(v.string(), v.minLength(1, 'Nome de imagem é obrigatório')))
});
