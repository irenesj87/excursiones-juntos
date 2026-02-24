import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSkeletonTheme } from "../../hooks/useSkeletonTheme";
import type { RootState } from "../../store/store";
import cardStyles from "./ExcursionCard.module.css";
import InfoItemStyles from "../../ui/InfoItem/InfoItem.module.css";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Define las dimensiones y anchos para los elementos del esqueleto para facilitar su mantenimiento.
 */
const SKELETON_SIZES = {
	TITLE_HEIGHT: 34,
	TITLE_WIDTH: "70%",
	DESCRIPTION_LINES: 4,
	DIFFICULTY_TEXT_WIDTH: 60,
	TIME_TEXT_WIDTH: 60,
	BUTTON_HEIGHT: 45,
	BUTTON_WIDTH: 174,
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

/**
 * Componente que muestra un esqueleto de carga para una ExcursionCard.
 */
function ExcursionCardSkeleton() {
	const { baseColor, highlightColor } = useSkeletonTheme();
	const user = useSelector((state: RootState) => state.loginReducer.user);
	const isLoggedIn = !!user;

	return (
		<SkeletonTheme
			baseColor={baseColor}
			highlightColor={highlightColor}
			borderRadius={8}
		>
			<Card
				className={`${cardStyles.excursionItemCard} h-100 w-100 overflow-hidden`}
				aria-hidden="true"
			>
				{/* Skeleton de la Imagen: Usamos aspect-ratio para evitar CLS y coincidir con el diseño final */}
				<div className={cardStyles.imageSkeletonContainer}>
					<Skeleton height="100%" containerClassName="h-100 w-100 d-block" />
				</div>

				<Card.Body
					className={`d-flex flex-column flex-grow-1 ${cardStyles.cardBody}`}
				>
					<div className={cardStyles.cardContent}>
						{/* Título */}
						<Skeleton
							height={SKELETON_SIZES.TITLE_HEIGHT}
							width={SKELETON_SIZES.TITLE_WIDTH}
						/>
						{/* Descripción */}
						<div className={cardStyles.excursionDescription}>
							<Skeleton count={SKELETON_SIZES.DESCRIPTION_LINES} />
						</div>
						{/* Detalles (Dificultad, Tiempo) */}
						<div className={cardStyles.infoItemsContainer}>
							<InfoItemSkeleton width={SKELETON_SIZES.DIFFICULTY_TEXT_WIDTH} />
							<InfoItemSkeleton width={SKELETON_SIZES.TIME_TEXT_WIDTH} />
						</div>
					</div>
					{/* Botón de "Apuntarse" */}
					{isLoggedIn && (
						<div className="mt-auto">
							<div className={cardStyles.cardActionArea}>
								<div className={cardStyles.joinButtonContainer}>
									<Skeleton
										height={SKELETON_SIZES.BUTTON_HEIGHT}
										className="w-100"
										borderRadius={12}
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
