"use client";
import { useRouter } from "next/navigation";
import { FormEvent, KeyboardEvent, useRef, useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      inputRef.current?.focus();
      return;
    }
    router.push(`/catalogo?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          name="search"
          id="search"
          placeholder="Pesquisa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="input input-bordered w-24 md:w-auto"
          aria-label="Campo de busca"
        />
      </div>
      <button
        type="submit"
        className="btn btn-ghost btn-circle"
        aria-label="Buscar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </form>
  );
}
