import Link from "next/link";
import formatCurrency from "@/utils/formatCurrency";

type ProductCardProps = {
  id: string;
  imagePath: string;
  imageAlt: string;
  productTitle: string;
  productDescription: string;
  productPrice: string;
};

export default function ProductCard({
  id,
  imagePath,
  imageAlt,
  productTitle,
  productDescription,
  productPrice
}: ProductCardProps) {
  return (
    <div className="h-full">
      <Link
        href={`/catalogo/${id}`}
        className="card w-80 md:w-96 h-full p-2 flex flex-col bg-base-100 hover:ring-1 hover:ring-white shadow-xl transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl"
        aria-label={`Ver detalhes de ${productTitle}`}
      >
        <figure className="image-full">
          <img
            src={imagePath}
            alt={imageAlt}
            width={400}
            height={225}
            loading="lazy"
            className="max-h-48 object-cover w-full"
          />
        </figure>
        <div className="card-body flex-grow">
          <h2 className="card-title">{productTitle}</h2>
          <p className="text-sm line-clamp-2">{productDescription}</p>
          <p className="font-bold text-lg mt-auto">
            {formatCurrency(productPrice)}
          </p>
        </div>
        <p className="opacity-30 px-8 text-xs">ID: {id}</p>
      </Link>
    </div>
  );
}
