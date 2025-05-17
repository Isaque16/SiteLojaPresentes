'use client';
import { useRouter } from 'next/navigation';
import { FormEvent, KeyboardEvent, useRef, useState } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      inputRef.current?.focus();
      return;
    }
    router.push(`/catalogo?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const clearSearch = () => {
    setSearchTerm('');
    inputRef.current?.focus();
    router.push('/catalogo');
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
          className="input input-bordered w-24 md:w-auto pl-3 pr-8"
          aria-label="Campo de busca"
        />
        {searchTerm && (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={clearSearch}
            aria-label="Limpar busca"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
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
