export default function LoadingProducts() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div className="skeleton w-full h-48 rounded-lg mb-4"></div>
        <div className="skeleton w-full h-48 rounded-lg mb-4"></div>
        <div className="skeleton w-full h-48 rounded-lg mb-4"></div>
        <div className="skeleton w-full h-48 rounded-lg mb-4"></div>
        <div className="skeleton w-full h-48 rounded-lg mb-4"></div>
        <div className="skeleton w-full h-48 rounded-lg mb-4"></div>
      </div>
      <div className="skeleton w-32 h-6 mt-4"></div>{" "}
    </div>
  );
}
