export default function Loading() {
  return (
    <>
      <h1 className="text-3xl font-bold text-center p-10 skeleton">
        Gerenciador de Estoque
      </h1>
      <main className="flex flex-col">
        <div className="flex min-h-screen flex-row items-center justify-around">
          {/* Formulário de carregamento */}
          <div className="flex flex-col items-start p-5 gap-5">
            {[...Array(7)].map((_, index) => (
              <div
                key={index}
                className="w-64 h-10 bg-gray-200 skeleton rounded"
              ></div>
            ))}
            <div className="w-32 h-10 bg-gray-200 skeleton rounded"></div>
          </div>

          {/* Grid de produtos (esqueleto) */}
          <div className="grid grid-col-1 gap-5 w-fit h-fit overflow-y-scroll min-w-96 max-h-screen border-2 border-white rounded-lg p-10">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-base-300 py-2 rounded-box flex flex-col items-center justify-center gap-2 skeleton"
              >
                <div className="w-40 h-24 bg-gray-200 skeleton rounded"></div>
                <div className="w-3/4 h-6 bg-gray-200 skeleton rounded"></div>
                <div className="w-1/2 h-6 bg-gray-200 skeleton rounded"></div>
                <div className="flex flex-row gap-5">
                  <div className="w-20 h-10 bg-gray-200 skeleton rounded"></div>
                  <div className="w-20 h-10 bg-gray-200 skeleton rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}