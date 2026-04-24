import { Pagination as BootstrapPagination } from "react-bootstrap";
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
			>
				{totalPages}
			</BootstrapPagination.Item>,
		);

		return pageNumbers;
	};

	return (
		<nav aria-label="Navegación de páginas de excursiones">
			<BootstrapPagination className={styles.paginationContainer}>
				<BootstrapPagination.Prev
					onClick={() => handlePageClick(currentPage - 1)}
					disabled={currentPage === 1}
				/>
				{renderPageNumbers()}
				<BootstrapPagination.Next
					onClick={() => handlePageClick(currentPage + 1)}
					disabled={currentPage === totalPages}
				/>
			</BootstrapPagination>
		</nav>
	);
}
