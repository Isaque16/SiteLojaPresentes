"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function SearchSgv() {
  const router = useRouter();
  const inputSearch = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const searchForResults = () => {
    if (!searchTerm) inputSearch.current?.focus();
    else router.push(`/catalogo?search=${searchTerm}`);
  };

  return (
    <>
      <label htmlFor="search" className="btn btn-ghost btn-circle">
        <span onClick={searchForResults} onKeyDown={searchForResults}>
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
        </span>
      </label>
      <div>
        <input
          ref={inputSearch}
          type="text"
          name="search"
          placeholder="Pesquisa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-24 md:w-auto"
        />
      </div>
    </>
  );
}
