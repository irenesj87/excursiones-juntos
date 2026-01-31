import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import type { DifficultyLevel } from "../../types";
import { NoImageIcon } from "../shared/Icons";
import cn from "classnames";
import styles from "./ExcursionCard.module.css";
import { API } from "../../constants";

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
	imgSrc,
	imgAlt,
}: ExcursionCardProps) {
	// Estado para manejar la carga suave de la imagen y evitar parpadeos
	const [isImageLoaded, setIsImageLoaded] = React.useState(false);
	const [hasImageError, setHasImageError] = React.useState(false);
	const imageBaseUrl = resolveImageBaseUrl(imgSrc);
	const detailPath = `/excursions/${id}`;

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
						{/* Stretched Link hace que toda la tarjeta sea clicable manteniendo la semántica */}
						<Link
							to={detailPath}
							className={styles.stretchedLink}
							state={{
								excursion: {
									id,
									name,
									area,
									difficulty,
									time,
									imgSrc,
								},
							}}
						>
							{name}
						</Link>
					</Card.Title>
				</div>
			</Card.Body>
		</Card>
	);
}

export default ExcursionCard;
