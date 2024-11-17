export default function LoadingOrders() {
  return Array.from({ length: 3 }).map((_, index) => (
    <div
      key={index}
      className="bg-base-300 py-2 rounded-box flex flex-col items-center justify-center gap-2"
    >
      <div className="card card-body card-bordered shadow-md w-full">
        <p className="skeleton h-4 w-3/4 mb-2"></p>
        <p className="skeleton h-4 w-full mb-2"></p>
        <p className="skeleton h-4 w-1/2 mb-2"></p>
        <p className="skeleton h-4 w-2/3 mb-2"></p>
        <p className="skeleton h-4 w-1/3 mb-2"></p>
        <p className="skeleton h-4 w-1/2 mb-2"></p>
        <p className="skeleton h-4 w-1/4 mb-2"></p>
      </div>
      <div className="flex flex-row gap-5 mb-10 md:mb-0">
        <button className="btn skeleton w-24 h-8"></button>
      </div>
    </div>
  ));
}
