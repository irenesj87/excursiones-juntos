import React from "react";
import {
	Pagination as PaginationRoot,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "../pagination";

interface PaginationProps {
	/** La página actual. */
	readonly currentPage: number;
	/** El número total de páginas. */
	readonly totalPages: number;
	/** Función que se llama cuando se cambia de página. */
	readonly onPageChange: (page: number) => void;
}

const PAGE_SIBLINGS = 1; // Cuántos números de página mostrar a cada lado del actual.

/**
 * Componente de paginación reutilizable y accesible.
 */
export function Pagination({
	currentPage,
	totalPages,
	onPageChange,
}: PaginationProps) {
	if (totalPages <= 1) {
		return null; // No renderizar si solo hay una página o menos.
	}

	const handlePageClick = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			onPageChange(page);
		}
	};

	const renderPageNumbers = () => {
		const pageNumbers = [];
		const startPage = Math.max(2, currentPage - PAGE_SIBLINGS);
		const endPage = Math.min(totalPages - 1, currentPage + PAGE_SIBLINGS);

		// Botón de primera página
		pageNumbers.push(
			<PaginationItem key="page-1">
				<PaginationLink
					isActive={currentPage === 1}
					onClick={() => handlePageClick(1)}
				>
					1
				</PaginationLink>
			</PaginationItem>,
		);

		// Elipsis inicial
		if (startPage > 2) {
			pageNumbers.push(
				<PaginationItem key="start-ellipsis">
					<PaginationEllipsis />
				</PaginationItem>,
			);
		}

		// Números intermedios
		for (let i = startPage; i <= endPage; i++) {
			pageNumbers.push(
				<PaginationItem key={`page-${i}`}>
					<PaginationLink
						isActive={i === currentPage}
						onClick={() => handlePageClick(i)}
					>
						{i}
					</PaginationLink>
				</PaginationItem>,
			);
		}

		// Elipsis final
		if (endPage < totalPages - 1) {
			pageNumbers.push(
				<PaginationItem key="end-ellipsis">
					<PaginationEllipsis />
				</PaginationItem>,
			);
		}

		// Botón de última página
		pageNumbers.push(
			<PaginationItem key={`page-${totalPages}`}>
				<PaginationLink
					isActive={currentPage === totalPages}
					onClick={() => handlePageClick(totalPages)}
				>
					{totalPages}
				</PaginationLink>
			</PaginationItem>,
		);

		return pageNumbers;
	};

	return (
		<PaginationRoot className="mt-12">
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						onClick={() => handlePageClick(currentPage - 1)}
						disabled={currentPage === 1}
					/>
				</PaginationItem>

				{renderPageNumbers()}

				<PaginationItem>
					<PaginationNext
						onClick={() => handlePageClick(currentPage + 1)}
						disabled={currentPage === totalPages}
					/>
				</PaginationItem>
			</PaginationContent>
		</PaginationRoot>
	);
}
