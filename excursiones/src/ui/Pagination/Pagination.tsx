import { Pagination as BootstrapPagination } from "react-bootstrap";
import { ChevronLeftIcon, ChevronRightIcon } from "../Icons";
import styles from "./Pagination.module.css";

interface PaginationProps {
	/** La página actual. */
	readonly currentPage: number;
	/** El número total de páginas. */
	readonly totalPages: number;
	/** Función que se llama cuando se cambia de página. */
	readonly onPageChange: (page: number) => void;
}

const SIBLING_COUNT = 1; // Cuántos números de página mostrar a cada lado del actual.

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
		const startPage = Math.max(2, currentPage - SIBLING_COUNT);
		const endPage = Math.min(totalPages - 1, currentPage + SIBLING_COUNT);

		// Botón de primera página
		pageNumbers.push(
			<BootstrapPagination.Item
				key={1}
				active={currentPage === 1}
				onClick={() => handlePageClick(1)}
				aria-label={
					currentPage === 1 ? `Página actual, página 1` : "Ir a la página 1"
				}
			>
				1
			</BootstrapPagination.Item>,
		);

		// Elipsis inicial
		if (startPage > 2) {
			pageNumbers.push(<BootstrapPagination.Ellipsis key="start-ellipsis" />);
		}

		// Números intermedios
		for (let i = startPage; i <= endPage; i++) {
			pageNumbers.push(
				<BootstrapPagination.Item
					key={i}
					active={i === currentPage}
					onClick={() => handlePageClick(i)}
					aria-label={
						i === currentPage
							? `Página actual, página ${i}`
							: `Ir a la página ${i}`
					}
				>
					{i}
				</BootstrapPagination.Item>,
			);
		}

		// Elipsis final
		if (endPage < totalPages - 1) {
			pageNumbers.push(<BootstrapPagination.Ellipsis key="end-ellipsis" />);
		}

		// Botón de última página
		pageNumbers.push(
			<BootstrapPagination.Item
				key={totalPages}
				active={currentPage === totalPages}
				onClick={() => handlePageClick(totalPages)}
				aria-label={
					currentPage === totalPages
						? `Página actual, página ${totalPages}`
						: `Ir a la página ${totalPages}`
				}
			>
				{totalPages}
			</BootstrapPagination.Item>,
		);

		return pageNumbers;
	};

	return (
		<nav aria-label="Navegación de páginas de excursiones">
			<BootstrapPagination className={styles.paginationContainer} role="list">
				<BootstrapPagination.First
					onClick={() => handlePageClick(currentPage - 1)}
					disabled={currentPage === 1}
					aria-label="Página anterior"
				>
					<ChevronLeftIcon size={18} />
				</BootstrapPagination.First>

				{renderPageNumbers()}

				<BootstrapPagination.Last
					onClick={() => handlePageClick(currentPage + 1)}
					disabled={currentPage === totalPages}
					aria-label="Página siguiente"
				>
					<ChevronRightIcon size={18} />
				</BootstrapPagination.Last>
			</BootstrapPagination>
		</nav>
	);
}
