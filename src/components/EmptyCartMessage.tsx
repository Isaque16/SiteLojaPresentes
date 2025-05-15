import Link from 'next/link';

export default function EmptyCartMessage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen px-5">
      <p className="text-2xl text-center">
        Tudo limpo por aqui,{' '}
        <Link href="/catalogo" className="link-hover text-info">
          adicione
        </Link>{' '}
        um novo produto à cesta.
      </p>
    </div>
  );
}
