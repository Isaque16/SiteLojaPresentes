export default function LoadingCatalog() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Título do catálogo */}
      <h1 className="text-4xl font-bold mb-4 p-10">CATÁLOGO</h1>

      {/* Layout de grid para os cartões */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-base-100 w-80 md:w-96 max-h-screen p-2 rounded-lg shadow-md skeleton"
          >
            <div className="w-full h-48 bg-gray-200 rounded skeleton mb-4"></div>{" "}
            {/* Imagem */}
            <div className="h-6 w-3/4 bg-gray-200 rounded skeleton mb-2"></div>{" "}
            {/* Nome */}
            <div className="h-4 w-5/6 bg-gray-200 rounded skeleton mb-2"></div>{" "}
            {/* Descrição */}
            <div className="h-6 w-1/2 bg-gray-200 rounded skeleton"></div>{" "}
            {/* Preço */}
          </div>
        ))}
      </div>
    </div>
  );
}
