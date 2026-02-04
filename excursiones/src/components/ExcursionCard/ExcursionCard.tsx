import React from "react";
import { Card } from "react-bootstrap";
import InfoItem from "../../ui/InfoItem/InfoItem";
import FeedbackAlert from "../../ui/FeedbackAlert/FeedbackAlert";
import type { DifficultyLevel } from "../../types";
import CustomButton from "../../ui/CustomButton/CustomButton";
import { useJoinExcursion } from "./useJoinExcursion";
import { getSafeErrorMessage } from "../../utils/errorUtils";
import {
	NoImageIcon,
	CheckIcon,
	MapIcon,
	ChartIcon,
	ClockIcon,
	JoinIcon,
} from "../../ui/Icons";
import cn from "classnames";
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
		<div className="d-grid d-xl-flex justify-content-xl-end">
			{isJoined ? (
				<span className={styles.joinedStatus} role="status">
					<CheckIcon className={styles.detailIcon} />
					Apuntado/a
				</span>
			) : (
				<CustomButton
					onClick={onJoin}
					className={styles.joinButton}
					isLoading={isJoining}
				>
					<JoinIcon className={styles.detailIcon} />
					Apúntate
				</CustomButton>
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

	// Si es externa, la retorna tal cual.
	if (src.startsWith("http")) return src;

	// Si es interna, construimos la URL y eliminamos la extensión para gestionar formatos modernos.
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
	/** Descripción breve de la excursión. */
	readonly description: string;
	/** Ubicación geográfica donde se lleva a cabo la excursión. */
	readonly area: string;
	/** Nivel de dificultad de la excursión. */
	readonly difficulty: DifficultyLevel;
	/** Duración aproximada de la excursión. */
	readonly time: string;
	/** Booleano que indica si el usuario actual está autenticado. */
	readonly isLoggedIn: boolean;
	/** Booleano que indica si el usuario ya se ha unido a esta excursión. */
	readonly isJoined: boolean;
	/** Callback opcional que se invoca cuando el usuario intenta unirse a la excursión. */
	readonly onJoin?: (_id: string | number) => Promise<void>;
	/** URL de la imagen principal de la excursión. */
	readonly imgSrc?: string;
	/** Texto alternativo para la imagen. */
	readonly imgAlt?: string;
}

/**
 * Componente que se encarga de renderizar una tarjeta que muestra la información de una excursión y permite a los 
 * usuarios apuntarse a ella.
 */
function ExcursionCard({
	id,
	name,
	description,
	area,
	difficulty,
	time,
	isLoggedIn,
	isJoined,
	onJoin,
	imgSrc,
	imgAlt,
}: ExcursionCardProps) {
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
	const [isImageLoaded, setIsImageLoaded] = React.useState(false);
	const [hasImageError, setHasImageError] = React.useState(false);
	const imageBaseUrl = resolveImageBaseUrl(imgSrc);
	const isExternalImage = imgSrc?.startsWith("http") ?? false;

	return (
		<Card
			as="article"
			className={cn(styles.excursionItemCard, "h-100 w-100 overflow-hidden")}
		>
			{/* Sección de imagen */}
			<div className={styles.imageContainer}>
				{imageBaseUrl && !hasImageError ? (
					<picture>
						{!isExternalImage && (
							<>
								<source srcSet={`${imageBaseUrl}.avif`} type="image/avif" />
								<source srcSet={`${imageBaseUrl}.webp`} type="image/webp" />
							</>
						)}
						<Card.Img
							as="img"
							variant="top"
							src={isExternalImage ? imageBaseUrl : `${imageBaseUrl}.jpg`}
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
			<Card.Body className="d-flex flex-column flex-grow-1">
				<div>
					{/* Título de la excursión */}
					<Card.Title as="h3" className={styles.excursionTitle}>
						{name}
					</Card.Title>
					{/* Descripción de la excursión */}
					<Card.Subtitle className={styles.excursionDescription}>
						{description}
					</Card.Subtitle>
					{/* Detalles de la excursión */}
					<div className={styles.infoItem}>
						<InfoItem text={area} label="Zona" icon={<MapIcon size={18} />} />
						<InfoItem
							text={difficulty}
							label="Dificultad"
							icon={<ChartIcon size={18} />}
						/>
						<InfoItem
							text={time}
							label="Tiempo estimado"
							icon={<ClockIcon size={18} />}
						/>
					</div>
				</div>
				{/* Área de acción: botón para unirse a la excursión */}
				{isLoggedIn && (
					<div className="mt-auto">
						<div className={styles.cardActionArea}>
							{joinError && (
								<FeedbackAlert
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

export default ExcursionCard;
