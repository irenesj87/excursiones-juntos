import React from "react";
import { Card } from "react-bootstrap";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSkeletonTheme } from "../../hooks/useSkeletonTheme";
import cardStyles from "./ExcursionCard.module.css"; // Se reutiliza el CSS de la tarjeta real
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Identificadores para los elementos del componente para facilitar las pruebas.
 */
export const TEST_IDS = {
	SKELETON_CARD: "excursion-card-skeleton",
};

/**
 * Define las dimensiones y anchos para los elementos del esqueleto para facilitar su mantenimiento.
 */
const SKELETON_SIZES = {
	TITLE_HEIGHT: 28, // Ajustado a 28px (aprox 1.75rem h3 line-height) para evitar CLS
	TITLE_WIDTH: "70%", // Ancho del esqueleto del título
};

/**
 * Componente que muestra un esqueleto de carga para una ExcursionCard.
 */
function ExcursionCardSkeleton() {
	const { baseColor, highlightColor } = useSkeletonTheme();

	return (
		<SkeletonTheme
			baseColor={baseColor}
			highlightColor={highlightColor}
			borderRadius={8}
		>
			<Card
				className={`${cardStyles.excursionItemCard} h-100 w-100 overflow-hidden`}
				aria-hidden="true"
				data-testid={TEST_IDS.SKELETON_CARD}
			>
				{/* Skeleton de la Imagen: Altura fija para evitar CLS y coincidir con el diseño final */}
				<div className={cardStyles.imageSkeletonContainer}>
					<Skeleton height="100%" containerClassName="h-100 w-100 d-block" />
				</div>

				<Card.Body className="d-flex flex-column flex-grow-1">
					<div>
						{/* Título */}
						<Skeleton
							height={SKELETON_SIZES.TITLE_HEIGHT}
							width={SKELETON_SIZES.TITLE_WIDTH}
							className="mb-3"
						/>
					</div>
				</Card.Body>
			</Card>
		</SkeletonTheme>
	);
}

export default ExcursionCardSkeleton;
