import React from "react";
import { Card } from "react-bootstrap";
import ExcursionDetailItem from "../ExcursionDetailItem";
import ErrorMessageAlert from "../ErrorMessageAlert/ErrorMessageAlert";
import type { DifficultyLevel } from "../../types";
import StyledButton from "../StyledButton";
import { useJoinExcursion } from "./useJoinExcursion";
import { getSafeErrorMessage } from "../../utils/errorUtils";
import { NoImageIcon, CheckIcon } from "../shared/Icons";
import cn from "classnames";
import styles from "./ExcursionCard.module.css";
import { API } from "../../constants";

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
 * Renderiza el botón para unirse a una excursión. Muestra un botón "Apuntarse", un estado de carga o un estado "Apuntado/a".
 */
function JoinButton({ isJoined, isJoining, onJoin }: JoinButtonProps) {
	return (
		<div className="d-grid d-md-flex justify-content-md-end">
			{isJoined ? (
				<span className={styles.joinedStatus} role="status">
					<CheckIcon className={styles.detailIcon} />
					Apuntado/a
				</span>
			) : (
				<StyledButton
					onClick={onJoin}
					className={styles.joinButton}
					isLoading={isJoining}
				>
					Apuntarse
				</StyledButton>
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
	// Si no hay src explícito, devolvemos cadena vacía para que el componente
	// renderice directamente el fallback sin intentar cargar nada.
	if (!src) return "";

	// Si src empieza por http significa que es una ruta externa completa, así que la deja igual.
	// Y si es una relativa, le añade la url de base.
	const fullPath = src.startsWith("http") ? src : `${API.BASE_URL}${src}`;
	// Elimina la extensión original del archivo para que después se le pueda añadir .webp o .jpg manuañmente.
	return fullPath.replace(/\.(jpe?g|png|webp|avif)$/i, "");
}

/**
 * Props de la tarjeta de la excursión.
 */
interface ExcursionCardProps {
	/** Identificador único de la excursión. */
	readonly id: string | number;
	/** Título de la excursión. */
	readonly name: string;
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
 * Componente que se encarga de renderizar una tarjeta que muestra la información de una excursión y permite a los usuarios
 * apuntarse a ella.
 */
function ExcursionCard({
	id,
	name,
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
	 * Si onJoin no se proporciona, se pasa una función asíncrona vacía para satisfacer el tipado del hook y evitar errores
	 * de TypeScript.
	 */
	const { isJoining, joinError, handleJoin, clearError } = useJoinExcursion(
		onJoin ?? (() => Promise.resolve())
	);

	/** Manejador para el evento de unirse a la excursión. */
	const handleOnJoin = () => {
		handleJoin(id);
	};

	// Estado para manejar la carga suave de la imagen y evitar parpadeos
	const [isImageLoaded, setIsImageLoaded] = React.useState(false);
	const [hasImageError, setHasImageError] = React.useState(false);
	const imageBaseUrl = resolveImageBaseUrl(imgSrc);

	return (
		<Card
			as="article"
			className={cn(styles.excursionItemCard, "h-100 w-100 overflow-hidden")}
		>
			{/* Sección de imagen */}
			<div className={styles.imageContainer}>
				{imageBaseUrl && !hasImageError ? (
					<picture>
						<source srcSet={`${imageBaseUrl}.webp`} type="image/webp" />
						<Card.Img
							as="img"
							variant="top"
							src={`${imageBaseUrl}.jpg`}
							alt={imgAlt ?? name}
							loading="lazy"
							decoding="async"
							width={640}
							height={360}
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
					{/* Detalles de la excursión */}
					<div className={styles.excursionDetails}>
						<ExcursionDetailItem text={area} label="Zona" />
						<ExcursionDetailItem text={difficulty} label="Dificultad" />
						<ExcursionDetailItem text={time} label="Tiempo estimado" />
					</div>
				</div>
				{/* Área de acción: botón para unirse a la excursión */}
				{isLoggedIn && (
					<div className="mt-auto">
						{/* Separador visual sutil antes de las acciones */}
						<hr className={styles.separator} />
						<div className={styles.cardActionArea}>
							{joinError && (
								<ErrorMessageAlert
									message={getSafeErrorMessage(joinError)}
									onClose={clearError}
									className="mb-2 small"
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
