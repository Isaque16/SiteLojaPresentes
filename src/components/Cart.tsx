"use client";
import { useBasketStore } from "@/store";
import Link from "next/link";
import formatCurrency from "@/utils/formatCurrency";

export default function Cart() {
  const { quantities, totalValue } = useBasketStore();

  const totalItems = quantities.reduce((acc, cur) => acc + cur, 0);

  return (
    <div className="flex-none">
      <div className="dropdown dropdown-top md:dropdown-bottom md:dropdown-end">
        <button
          aria-label="Carrinho de compras"
          className="btn btn-ghost btn-circle"
        >
          <div className="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span
              className="badge badge-sm indicator-item"
              aria-label={`${totalItems} itens no carrinho`}
            >
              {totalItems}
            </span>
          </div>
        </button>
        <div className="card card-compact dropdown-content bg-base-100 z-10 mt-3 w-52 shadow-md">
          <div className="card-body">
            <span className="text-lg font-bold">
              {totalItems} {totalItems === 1 ? "Item" : "Itens"}
            </span>
            <span className="text-info">
              Subtotal: {formatCurrency(totalValue)}
            </span>
            <div className="card-actions">
              <Link href="/cesta/" className="btn btn-primary btn-block">
                Ver carrinho
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
