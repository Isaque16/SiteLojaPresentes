import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  maxVisiblePages = 5
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Função para renderizar um botão de página
  const renderPageButton = (pageNumber: number, label?: string | React.ReactNode, disabled?: boolean) => (
    <button
      key={`page-${pageNumber}-${label}`}
      className={`join-item btn ${currentPage === pageNumber ? 'btn-active' : ''} ${disabled ? 'btn-disabled' : ''}`}
      onClick={() => onPageChange(pageNumber)}
      disabled={disabled}
    >
      {label || pageNumber}
    </button>
  );

  // Cálculos para determinar quais páginas mostrar
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      // Se temos poucas páginas, mostrar todas
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Caso contrário, mostrar um subconjunto com elipses
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(currentPage - halfVisible, 1);
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
    
    // Ajustar se estamos perto do fim
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    // Adicionar elipses, se necessário
    const result: (number | string)[] = [];

    if (startPage > 1) {
      result.push(1);
      if (startPage > 2) result.push('...');
    }

    result.push(...pages);

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) result.push('...');
      result.push(totalPages);
    }

    return result;
  };

  return (
    <div className={`join ${className}`}>
      {/* Botão para página anterior */}
      {renderPageButton(
        currentPage - 1, 
        <span>&laquo;</span>, 
        currentPage === 1
      )}

      {/* Páginas numeradas */}
      {getVisiblePages().map((page, index) => {
        if (typeof page === 'string') {
          return (
            <button key={`ellipsis-${index}`} className="join-item btn btn-disabled">
              {page}
            </button>
          );
        }
        return renderPageButton(page);
      })}

      {/* Botão para próxima página */}
      {renderPageButton(
        currentPage + 1, 
        <span>&raquo;</span>, 
        currentPage === totalPages
      )}
    </div>
  );
}
