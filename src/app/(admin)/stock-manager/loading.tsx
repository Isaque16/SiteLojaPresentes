export default function Loading() {
  return (
    <>
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-base-300 py-2 rounded-box flex flex-col items-center justify-center gap-2 skeleton"
        >
          <div className="w-80 md:w-96 max-h-screen h-24 bg-gray-200 skeleton rounded"></div>
          <div className="w-3/4 h-6 bg-gray-200 skeleton rounded"></div>
          <div className="w-1/2 h-6 bg-gray-200 skeleton rounded"></div>
          <div className="flex flex-row gap-5">
            <div className="w-20 h-10 bg-gray-200 skeleton rounded"></div>
            <div className="w-20 h-10 bg-gray-200 skeleton rounded"></div>
          </div>
        </div>
      ))}
    </>
  );
}
