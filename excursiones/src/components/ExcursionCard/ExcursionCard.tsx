import { useState } from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { DetailItem } from "../../ui/DetailItem";
import { Alert } from "../../ui/Alert";
import type { DifficultyLevel } from "../../types";
import { Button } from "../../ui/Button";
import { useJoinExcursion } from "./useJoinExcursion";
import { getSafeErrorMessage } from "../../utils/errorUtils";
import {
	NoImageIcon,
	CheckIcon,
	MapIcon,
	ChartIcon,
	ClockIcon,
} from "../../ui/Icons";
import cn from "classnames";
import type { RootState } from "../../store/store";
import styles from "./ExcursionCard.module.css";
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
		<div className={styles.joinButtonContainer}>
			{isJoined ? (
				<span className={styles.joinedStatus} role="status">
					<CheckIcon className={styles.detailIcon} />
					Unido/a
				</span>
			) : (
				<Button
					onClick={onJoin}
					className={styles.joinButton}
					isLoading={isJoining}
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
		<div className={styles.imageFallback}>
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
		<Card
			as="article"
			className={cn(styles.excursionItemCard, "h-100 w-100 overflow-hidden")}
		>
			{/* Sección de imagen */}
			<div className={styles.imageContainer}>
				{/* Badge Flotante de Zona */}
				<div className={styles.floatingBadge}>
					<MapIcon size={14} className={styles.infoIcon} />
					{area}
				</div>

				{imageBaseUrl && !hasImageError ? (
					<picture>
						<source srcSet={`${imageBaseUrl}.avif`} type="image/avif" />
						<source srcSet={`${imageBaseUrl}.webp`} type="image/webp" />
						<Card.Img
							as="img"
							variant="top"
							src={`${imageBaseUrl}.jpg`}
							alt={imgAlt ?? name}
							loading="lazy"
							decoding="async"
							width={IMG_WIDTH}
							height={IMG_HEIGHT}
							className={cn(styles.cardImage, {
								[styles.imageLoaded]: isImageLoaded,
							})}
							onLoad={() => setIsImageLoaded(true)}
							onError={() => setHasImageError(true)}
						/>
					</picture>
				) : (
					<ImageFallback />
				)}
			</div>
			{/* Cuerpo de la tarjeta con detalles de la excursión y acciones. */}
			<Card.Body
				className={`d-flex flex-column flex-grow-1 ${styles.cardBody}`}
			>
				<div className={styles.cardContent}>
					{/* Título de la excursión */}
					<Card.Title as="h3" className={styles.excursionTitle}>
						{name}
					</Card.Title>
					{/* Descripción de la excursión */}
					<Card.Text as="p" className={styles.excursionDescription}>
						{description}
					</Card.Text>
					{/* Detalles de la excursión */}
					<div className={styles.infoItemsContainer}>
						<DetailItem
							text={difficulty}
							label="Dificultad"
							icon={<ChartIcon size={18} className={styles.infoIcon} />}
						/>
						<DetailItem
							text={time}
							label="Tiempo estimado"
							icon={<ClockIcon size={18} className={styles.infoIcon} />}
						/>
					</div>
				</div>
				{/* Área de acción: botón para unirse a la excursión */}
				{isLoggedIn && (
					<div className="mt-auto">
						<div className={styles.cardActionArea}>
							{joinError && (
								<Alert
									message={getSafeErrorMessage(joinError)}
									variant="danger"
									onClose={clearError}
									className="mb-2"
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
			</Card.Body>
		</Card>
	);
}
