import React from "react";
import { Card } from "react-bootstrap";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSkeletonTheme } from "../../hooks/useSkeletonTheme";
import cardStyles from "./ExcursionCard.module.css"; // Se reutiliza el CSS de la tarjeta real
import InfoItemStyles from "../../ui/InfoItem/InfoItem.module.css";
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
	TITLE_HEIGHT: 28, // Ajustado a 28px (aprox 1.75rem h3 line-height) para evitar CLS
	TITLE_WIDTH: "70%", // Ancho del esqueleto del título
	AREA_TEXT_WIDTH: 84, // Ancho del esqueleto del texto de área
	DIFFICULTY_TEXT_WIDTH: 76, // Ancho del esqueleto del texto de dificultad
	TIME_TEXT_WIDTH: 60, // Ajustado a múltiplo de 4 (antes 58)
	BUTTON_HEIGHT: 44, // Ajustado a 44px para coincidir con el botón real (padding 0.5rem + border + line-height)
	BUTTON_MIN_WIDTH: 120, // Ajustado a múltiplo de 4 (antes 117)
};

interface InfoItemSkeletonProps {
	/** El ancho del esqueleto de texto. */
	readonly width: number | string;
}

/**
 * Componente auxiliar para renderizar el esqueleto de un ítem de detalle.
 */
function InfoItemSkeleton({ width }: InfoItemSkeletonProps) {
	return (
		<div className={InfoItemStyles.infoItem} aria-hidden="true">
			<Skeleton circle width={18} height={18} />
			<Skeleton width={width} />
		</div>
	);
}

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
						{/* Descripción: Simula un párrafo breve de 3 líneas */}
						<div className="mb-4">
							<Skeleton count={2} style={{ marginBottom: 6 }} />
							<Skeleton width="60%" />
						</div>
						{/* Detalles (Zona, Dificultad, Tiempo) */}
						<div className={cardStyles.infoItem}>
							<InfoItemSkeleton width={SKELETON_SIZES.AREA_TEXT_WIDTH} />
							<InfoItemSkeleton
								width={SKELETON_SIZES.DIFFICULTY_TEXT_WIDTH}
							/>
							<InfoItemSkeleton width={SKELETON_SIZES.TIME_TEXT_WIDTH} />
						</div>
					</div>
					{/* Botón de "Apuntarse" */}
					{isLoggedIn && (
						<div className="mt-auto" data-testid={TEST_IDS.BUTTON_CONTAINER}>
							<div className={cardStyles.cardActionArea}>
								<div className="d-grid d-xl-flex justify-content-xl-end">
									<Skeleton
										height={SKELETON_SIZES.BUTTON_HEIGHT}
										className="w-100"
										style={{ minWidth: SKELETON_SIZES.BUTTON_MIN_WIDTH }}
										borderRadius={24}
									/>
								</div>
							</div>
						</div>
					)}
				</Card.Body>
			</Card>
		</SkeletonTheme>
	);
}

export default ExcursionCardSkeleton;
