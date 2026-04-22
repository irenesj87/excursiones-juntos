import { useSelector } from "react-redux";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSkeletonTheme } from "../../hooks/useSkeletonTheme";
import type { RootState } from "../../store/store";
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
		<div className="flex items-center gap-2" aria-hidden="true">
			<Skeleton circle width={16} height={16} />
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
			<article
				className="relative flex flex-col h-full w-full overflow-hidden bg-card border border-border rounded-lg shadow-sm"
				aria-hidden="true"
			>
				{/* Skeleton de la Imagen: Usamos aspect-ratio para evitar CLS y coincidir con el diseño final */}
				<div className="relative aspect-video w-full min-h-[240px] overflow-hidden bg-muted/20">
					<Skeleton height="100%" containerClassName="h-full w-full block" />
				</div>

				{/* Cuerpo de la tarjeta: Reflejamos exactamente los paddings y gaps de ExcursionCard */}
				<div className="flex flex-col flex-grow px-6 pt-6 pb-4 gap-3">
					<div className="flex flex-col gap-3">
						{/* Título */}
						<Skeleton
							height={SKELETON_SIZES.TITLE_HEIGHT}
							width={SKELETON_SIZES.TITLE_WIDTH}
						/>
						{/* Descripción */}
						<div className="space-y-1">
							<Skeleton count={SKELETON_SIZES.DESCRIPTION_LINES} />
						</div>
						{/* Detalles (Dificultad, Tiempo) */}
						<div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-1">
							<InfoItemSkeleton width={SKELETON_SIZES.DIFFICULTY_TEXT_WIDTH} />
							<InfoItemSkeleton width={SKELETON_SIZES.TIME_TEXT_WIDTH} />
						</div>
					</div>
					{/* Área de acción (Solo si el usuario está logueado, igual que en el componente real) */}
					{isLoggedIn && (
						<div className="flex flex-col justify-center pt-4 border-t border-border/50 mt-4">
							<Skeleton
								height={SKELETON_SIZES.BUTTON_HEIGHT}
								className="w-full"
								borderRadius={24}
							/>
						</div>
					)}
				</div>
			</article>
		</SkeletonTheme>
	);
}

export default ExcursionCardSkeleton;
