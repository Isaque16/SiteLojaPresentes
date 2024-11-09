export default interface IProduct {
  readonly _id?: string;
  nome: string;
  categoria: string;
  preco: number;
  quantidade: number;
  descricao: string;
  imagem: string;
  nomeImagem: string;
}
