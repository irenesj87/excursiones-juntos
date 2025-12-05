import React from "react";
import { Card } from "react-bootstrap";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSkeletonTheme } from "../../hooks/useSkeletonTheme";
import cardStyles from "./ExcursionCard.module.css"; // Se reutiliza el CSS de la tarjeta real
import detailItemStyles from "../ExcursionDetailItem/ExcursionDetailItem.module.css";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Identificadores para los elementos del componente para facilitar las pruebas.
 */
export const TEST_IDS = {
	SKELETON_CARD: "excursion-card-skeleton",
	BUTTON_CONTAINER: "button-skeleton-container",
};

/**
 * Define las dimensiones y anchos para los elementos del esqueleto para facilitar su mantenimiento.
 */
const SKELETON_SIZES = {
	TITLE_HEIGHT: 21, // Altura del esqueleto del título
	TITLE_WIDTH: "70%", // Ancho del esqueleto del título
	AREA_TEXT_WIDTH: 84, // Ancho del esqueleto del texto de área
	DIFFICULTY_TEXT_WIDTH: 76, // Ancho del esqueleto del texto de dificultad
	TIME_TEXT_WIDTH: 58, // Ancho del esqueleto del texto de tiempo
	BUTTON_HEIGHT: 43, // Altura del esqueleto del botón
	BUTTON_MIN_WIDTH: 117, // Ancho mínimo del esqueleto del botón
};

interface DetailItemSkeletonProps {
	/** El ancho del esqueleto de texto. */
	width: number | string;
}

/**
 * Componente auxiliar para renderizar el esqueleto de un ítem de detalle.
 */
const DetailItemSkeleton = ({ width }: DetailItemSkeletonProps) => (
	<button type="button" className={detailItemStyles.detailItem} disabled>
		<Skeleton width={width} />
	</button>
);

interface ExcursionCardSkeletonProps {
	/** Indica si el usuario ha iniciado sesión para mostrar el placeholder del botón. */
	readonly isLoggedIn?: boolean;
}

/**
 * Componente que muestra un esqueleto de carga para una ExcursionCard.
 */
function ExcursionCardSkeleton({
	isLoggedIn = false,
}: ExcursionCardSkeletonProps) {
	const { baseColor, highlightColor } = useSkeletonTheme();

	return (
		<SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
			<Card
				className={`${cardStyles.excursionItemCard} h-100 w-100`}
				aria-hidden="true"
				data-testid={TEST_IDS.SKELETON_CARD}
			>
				<Card.Body className="d-flex flex-column flex-grow-1">
					<div>
						{/* Título */}
						<Skeleton
							height={SKELETON_SIZES.TITLE_HEIGHT}
							width={SKELETON_SIZES.TITLE_WIDTH}
							className="mb-3"
						/>
						{/* Detalles (Zona, Dificultad, Tiempo) */}
						<div className={cardStyles.excursionDetails}>
							<DetailItemSkeleton width={SKELETON_SIZES.AREA_TEXT_WIDTH} />
							<DetailItemSkeleton
								width={SKELETON_SIZES.DIFFICULTY_TEXT_WIDTH}
							/>
							<DetailItemSkeleton width={SKELETON_SIZES.TIME_TEXT_WIDTH} />
						</div>
					</div>
					{/* Botón de "Apuntarse" */}
					{isLoggedIn && (
						<div
							className="mt-auto pt-3"
							data-testid={TEST_IDS.BUTTON_CONTAINER}
						>
							<div className="d-grid d-md-flex justify-content-md-end">
								<Skeleton
									height={SKELETON_SIZES.BUTTON_HEIGHT}
									className="w-100"
									style={{ minWidth: SKELETON_SIZES.BUTTON_MIN_WIDTH }}
								/>
							</div>
						</div>
					)}
				</Card.Body>
			</Card>
		</SkeletonTheme>
	);
}

export default ExcursionCardSkeleton;
