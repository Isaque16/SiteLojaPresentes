export default function Loading() {
  return (
    <>
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="card w-80 md:w-96 max-h-screen bg-base-300 shadow-xl p-2 flex flex-col gap-4 skeleton"
        >
          <div className="image-full bg-gray-200 skeleton h-56 w-full rounded"></div>
          <div className="card-body flex flex-col gap-2">
            <div className="w-3/4 h-6 bg-gray-200 skeleton rounded"></div>
            <div className="w-full h-4 bg-gray-200 skeleton rounded"></div>
            <div className="w-1/3 h-6 bg-gray-200 skeleton rounded"></div>
          </div>
          <div className="opacity-30 mx-8 w-1/4 h-4 bg-gray-200 skeleton rounded"></div>
        </div>
      ))}
    </>
  );
}
