import Link from "next/link";
import { Cart, SearchBar, UserAvatar } from "@/components";

export default function NavBar() {
  return (
    <nav className="menu menu-horizontal w-full px-4 flex flex-row justify-between items-center shadow-md z-50">
      <div className="flex flex-row">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl">
            Crer Presentes
          </Link>
        </div>
        <div className="flex flex-row justify-start">
          <SearchBar />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="hidden md:flex menu menu-vertical md:menu-horizontal rounded-box text-xl"
      >
        <li>
          <Link href="/">Sobre nós</Link>
        </li>
        <li>
          <Link href="/catalogo">Produtos</Link>
        </li>
        <li>
          <Link href="/catalogo">Cestas</Link>
        </li>
      </ul>
      <div className="hidden md:flex flex-row justify-center items-center gap-5">
        <Cart />
        <UserAvatar />
      </div>
    </nav>
  );
}
