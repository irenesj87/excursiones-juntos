import { useState } from "react";
import { useSelector } from "react-redux";
import InfoItem from "../../ui/InfoItem/InfoItem";
import { FeedbackAlert } from "../../ui/FeedbackAlert";
import type { DifficultyLevel } from "../../types";
import { Button } from "../../ui/button";
import { useJoinExcursion } from "./useJoinExcursion";
import { getSafeErrorMessage } from "../../utils/errorUtils";
import {
	NoImageIcon,
	CheckIcon,
	MapIcon,
	ChartIcon,
	ClockIcon,
} from "../../ui/Icons";
import { cn } from "../../lib/utils";
import type { RootState } from "../../store/store";
import { API } from "../../constants";

/**
 * Constantes para las dimensiones de la imagen.
 */
const IMG_WIDTH = 640;
const IMG_HEIGHT = 360;

/**
 * Función vacía que retorna una promesa resuelta inmediatamente.
 * Se utiliza como mecanismo de seguridad para el hook useJoinExcursions ya que en React los hooks
 * no pueden ser condicionales, es decir, que siempre deben ejecutarse.
 */
const NO_OP_JOIN = () => Promise.resolve();

/**
 * Props del botón para unirse a una excursión.
 */
interface JoinButtonProps {
	/** Indica si el usuario ya se ha apuntado a la excursión. */
	readonly isJoined: boolean;
	/** Muestra si la acción de unirse está en progreso. */
	readonly isJoining: boolean;
	/** Callback que se ejecuta cuando se cliquea el botón para apuntarse. */
	readonly onJoin: () => void;
}

/**
 * Renderiza el botón para unirse a una excursión. Muestra un botón, un estado de carga o un estado "Apuntado/a".
 */
function JoinButton({ isJoined, isJoining, onJoin }: JoinButtonProps) {
	return (
		<div className="grid">
			{isJoined ? (
				<span
					className="inline-flex justify-center items-center gap-2 text-nature-700 dark:text-nature-100 font-bold py-2.5 px-5 bg-nature-100/30 dark:bg-nature-700/20 border border-nature-600 dark:border-nature-700 rounded-full"
					role="status"
				>
					<CheckIcon size={18} className="text-nature-600" />
					Unido/a
				</span>
			) : (
				<Button
					onClick={onJoin}
					isLoading={isJoining}
					className="font-bold uppercase tracking-wider text-xs"
				>
					Unirse
				</Button>
			)}
		</div>
	);
}

/**
 * Componente visual de respaldo para cuando la imagen no se puede cargar.
 */
function ImageFallback() {
	return (
		<div className="flex items-center justify-center w-full h-full bg-muted/30 text-muted-foreground/40">
			<NoImageIcon size={48} aria-hidden="true" />
			<span className="visually-hidden">Imagen no disponible</span>
		</div>
	);
}

/**
 * Helper para resolver la URL base de la imagen, sin la extensión del archivo.
 */
function resolveImageBaseUrl(src?: string): string {
	// Si no hay src explícito, se retorna cadena vacía para que el componente
	// renderice directamente el fallback sin intentar cargar nada.
	if (!src) return "";

	// Construimos la URL base y eliminamos la extensión para gestionar formatos modernos.
	return `${API.BASE_URL}${src}`.replace(/\.(jpe?g|png|webp|avif)$/i, "");
}

/**
 * Props de la tarjeta de la excursión.
 */
interface ExcursionCardProps {
	/** Identificador único de la excursión. */
	readonly id: string | number;
	/** Título de la excursión. */
	readonly name: string;
	/** Descripción de la excursión. */
	readonly description: string;
	/** Ubicación geográfica donde se lleva a cabo la excursión. */
	readonly area: string;
	/** Nivel de dificultad de la excursión. */
	readonly difficulty: DifficultyLevel;
	/** Duración aproximada de la excursión. */
	readonly time: string;
	/** Callback opcional que se invoca cuando el usuario intenta unirse a la excursión. */
	readonly onJoin?: (_id: string | number) => Promise<void>;
	/** URL de la imagen de la excursión. */
	readonly imgSrc?: string;
	/** Texto alternativo para la imagen. */
	readonly imgAlt?: string;
}

/**
 * Componente que se encarga de renderizar una tarjeta que muestra la información de una excursión y permite a los
 * usuarios apuntarse a ella.
 */
export function ExcursionCard({
	id,
	name,
	description,
	area,
	difficulty,
	time,
	onJoin,
	imgSrc,
	imgAlt,
}: ExcursionCardProps) {
	/*
	 * Se obtiene el usuario del store de Redux para determinar si está logueado y si ya se ha apuntado a esta
	 * excursión.
	 */
	const user = useSelector((state: RootState) => state.loginReducer.user);
	const isLoggedIn = !!user;
	// La excursión ya se considera unida si el usuario existe y su lista de excursiones incluye el ID de esta
	// excursión. Si no hay usuario, se asume que no está unido.
	const isJoined = user?.excursions.includes(id) ?? false;

	/*
	 * La lógica para unirse a la excursión se encapsula en un hook personalizado para simplificar este componente y
	 * hacerlo puramente presentacional.
	 * Si onJoin no se proporciona, se pasa una función asíncrona vacía para satisfacer el tipado del hook, ya que
	 * los hooks siempre deben ejecutarse, y esta cumple los requisitos de tipado para evitar errores de TypeScript.
	 */
	const { isJoining, joinError, handleJoin, clearError } = useJoinExcursion(
		onJoin ?? NO_OP_JOIN,
	);

	/** Manejador para el evento de unirse a la excursión. */
	const handleOnJoin = () => {
		handleJoin(id);
	};

	// Estado para manejar la carga suave de la imagen y evitar parpadeos
	const [isImageLoaded, setIsImageLoaded] = useState(false);
	const [hasImageError, setHasImageError] = useState(false);
	const imageBaseUrl = resolveImageBaseUrl(imgSrc);

	return (
		<article className="relative flex flex-col h-full w-full overflow-hidden bg-card rounded-lg shadow-sm border border-border/40">
			{/* Sección de imagen */}
			<div className="relative aspect-video w-full min-h-[240px] overflow-hidden bg-muted/20">
				{/* Badge Flotante de Zona */}
				<div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-background px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-foreground shadow-sm dark:border-nature-700/50 pointer-events-none">
					<MapIcon size={14} className="text-nature-600" />
					{area}
				</div>

				{imageBaseUrl && !hasImageError ? (
					<picture className="block h-full w-full">
						<source srcSet={`${imageBaseUrl}.avif`} type="image/avif" />
						<source srcSet={`${imageBaseUrl}.webp`} type="image/webp" />
						<img
							src={`${imageBaseUrl}.jpg`}
							alt={imgAlt ?? name}
							loading="lazy"
							decoding="async"
							width={IMG_WIDTH}
							height={IMG_HEIGHT}
							className={cn(
								"h-full w-full object-cover transition-opacity duration-700 ease-out",
								isImageLoaded ? "opacity-100" : "opacity-0",
							)}
							onLoad={() => setIsImageLoaded(true)}
							onError={() => setHasImageError(true)}
						/>
					</picture>
				) : (
					<ImageFallback />
				)}
			</div>

			{/* Cuerpo de la tarjeta con detalles de la excursión y acciones. */}
			<div className="flex flex-col flex-grow px-6 pt-6 pb-4 gap-3">
				<div className="flex flex-col gap-3">
					{/* Título de la excursión */}
					<h3 className="text-xl font-semibold tracking-tight text-foreground leading-snug">
						{name}
					</h3>
					{/* Descripción de la excursión */}
					<p className="line-clamp-4 text-sm text-muted-foreground leading-relaxed max-w-[60ch]">
						{description}
					</p>
					{/* Detalles de la excursión */}
					<div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-1">
						<InfoItem
							text={difficulty}
							label="Dificultad"
							icon={
								<ChartIcon size={16} className="text-nature-600 shrink-0" />
							}
						/>
						<InfoItem
							text={time}
							label="Tiempo estimado"
							icon={
								<ClockIcon size={16} className="text-nature-600 shrink-0" />
							}
						/>
					</div>
				</div>
				{/* Área de acción: botón para unirse a la excursión */}
				{isLoggedIn && (
					<div className="flex flex-col justify-center pt-4 border-t border-border/50 mt-4">
						<div className="grid animate-in fade-in slide-in-from-bottom-1 duration-500">
							{joinError && (
								<FeedbackAlert
									message={getSafeErrorMessage(joinError)}
									variant="danger"
									onClose={clearError}
									className="mb-3"
								/>
							)}
							<JoinButton
								isJoined={isJoined}
								isJoining={isJoining}
								onJoin={handleOnJoin}
							/>
						</div>
					</div>
				)}
			</div>
		</article>
	);
}
