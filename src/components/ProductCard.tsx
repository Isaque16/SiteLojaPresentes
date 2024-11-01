// import Image from "next/image";

export default function ProductCard({
  _id,
  imagePath,
  imageAlt,
  productTitle,
  productDescription,
  productPrice,
}: {
  _id: string;
  imagePath: string;
  imageAlt: string;
  productTitle: string;
  productDescription: string;
  productPrice: string;
}) {
  return (
    <div className="card w-96 overflow-y-scroll bg-base-100 shadow-xl p-2 skeleton">
      <figure>
        <img src={imagePath} alt={imageAlt} width={400} height={225} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{productTitle}</h2>
        <p>{productDescription}</p>
        <p>{productPrice}</p>
      </div>
      <p className="opacity-30 px-8">ID: {_id}</p>
    </div>
  );
}
