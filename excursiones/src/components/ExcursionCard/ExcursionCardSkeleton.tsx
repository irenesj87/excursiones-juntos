import { useSelector } from "react-redux";
import { Skeleton } from "../../ui/skeleton";
import type { RootState } from "../../store/store";

/**
 * Define las dimensiones y anchos para los elementos del esqueleto para facilitar su mantenimiento.
 */
const SKELETON_SIZES = {
	TITLE_HEIGHT: 34,
	TITLE_WIDTH: "70%",
	DIFFICULTY_TEXT_WIDTH: 60,
	TIME_TEXT_WIDTH: 60,
	BUTTON_HEIGHT: 45,
	BUTTON_WIDTH: 174,
};

/**
 * Identificadores estables para las líneas de descripción del esqueleto.
 * Evita el uso de índices en las keys para cumplir con las mejores prácticas de React.
 */
const DESCRIPTION_LINE_KEYS = [
	"sk-line-1",
	"sk-line-2",
	"sk-line-3",
	"sk-line-4",
];

interface InfoItemSkeletonProps {
	/** El ancho del esqueleto de texto. */
	readonly width: number | string;
}

/**
 * Componente auxiliar para renderizar el esqueleto de un ítem de detalle.
 */
function InfoItemSkeleton({ width }: InfoItemSkeletonProps) {
	return (
		<div className="flex items-center gap-2">
			<Skeleton className="h-4 w-4 rounded-full" />
			<Skeleton className="h-4" style={{ width: width }} />
		</div>
	);
}

/**
 * Componente que muestra un esqueleto de carga para una ExcursionCard.
 * Cumple con WCAG AAA al proporcionar un estado visual sin parpadeos.
 */
function ExcursionCardSkeleton() {
	const user = useSelector((state: RootState) => state.loginReducer.user);
	const isLoggedIn = !!user;

	return (
		<article
			className="relative flex flex-col h-full w-full overflow-hidden bg-card rounded-lg shadow-sm"
			aria-hidden="true"
		>
			{/* Skeleton de la Imagen: Usamos aspect-ratio para evitar CLS y coincidir con el diseño final */}
			<div className="relative aspect-video w-full min-h-[240px] overflow-hidden bg-muted/20">
				<Skeleton className="h-full w-full rounded-b-none" />
			</div>

			{/* Cuerpo de la tarjeta: Reflejamos exactamente los paddings y gaps de ExcursionCard */}
			<div className="flex flex-col flex-grow px-6 pt-6 pb-4 gap-3">
				<div className="flex flex-col gap-3">
					{/* Título */}
					<Skeleton
						className="h-[34px]"
						style={{ width: SKELETON_SIZES.TITLE_WIDTH }}
					/>
					{/* Descripción */}
					<div className="space-y-1">
						{DESCRIPTION_LINE_KEYS.map((lineKey) => (
							<Skeleton key={lineKey} className="h-4 w-full" />
						))}
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
						<Skeleton className="h-[45px] w-full rounded-full" />
					</div>
				)}
			</div>
		</article>
	);
}

export default ExcursionCardSkeleton;
