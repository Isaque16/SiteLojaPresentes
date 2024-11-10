export default function LoadingProduct() {
  return (
    <main className="flex flex-col md:flex-row justify-around items-center gap-10 h-screen">
      {/* Imagem do produto em estado de carregamento */}
      <div className="bg-base-100 w-1/2 h-96 p-4 rounded-box m-4 skeleton"></div>

      {/* Detalhes do produto em estado de carregamento */}
      <div className="flex flex-col gap-4 w-full md:w-1/2 px-10">
        <div className="h-10 w-3/4 bg-gray-200 rounded skeleton"></div>{" "}
        {/* Título */}
        <div className="h-5 w-full bg-gray-200 rounded skeleton"></div>{" "}
        {/* Descrição */}
        <div className="h-5 w-1/2 bg-gray-200 rounded skeleton"></div>{" "}
        {/* Preço */}
        <div className="h-5 w-1/4 bg-gray-200 rounded skeleton"></div>{" "}
        {/* Categoria */}
        {/* Quantidade e botões */}
        <div className="flex items-center gap-4 mt-4">
          <div className="h-12 w-20 bg-gray-200 rounded skeleton"></div>{" "}
          {/* Quantidade */}
          <div className="h-12 w-32 bg-primary text-white btn skeleton"></div>{" "}
          {/* Botão adicionar */}
          <div className="h-12 w-32 bg-secondary text-white btn skeleton"></div>{" "}
          {/* Botão comprar */}
        </div>
      </div>
    </main>
  );
}
