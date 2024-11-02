// import Image from "next/image";

export default function ProductCard({
  id,
  imagePath,
  imageAlt,
  productTitle,
  productDescription,
  productPrice,
  onClick,
}: {
  id: string;
  imagePath: string;
  imageAlt: string;
  productTitle: string;
  productDescription: string;
  productPrice: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <div 
      onClick={onClick}
      className="card w-96 max-h-screen bg-base-100 hover:ring-1 hover:ring-white shadow-xl p-2 cursor-pointer"
    >
      <figure>
        <img src={imagePath} alt={imageAlt} width={400} height={225} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{productTitle}</h2>
        <p>{productDescription}</p>
        <p>{productPrice}</p>
      </div>
      <p className="opacity-30 px-8">ID: {id}</p>
    </div>
  );
}
