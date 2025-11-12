import React, { useId, useState, useEffect } from "react";
import { Card, Alert } from "react-bootstrap";
import ExcursionDetailItem from "../ExcursionDetailItem";
import StyledButton from "../StyledButton";
import { useJoinExcursion } from "../../hooks/useJoinExcursion";
import cn from "classnames";
import { getSafeErrorMessage } from "../../utils/errorUtils";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./ExcursionCard.module.css";

/**
 * Hook para obtener el valor anterior de una prop o estado.
 */
const usePrevious = <T,>(value: T): T | undefined => {
	const ref = React.useRef<T | undefined>(undefined);
	React.useEffect(() => {
		ref.current = value;
	});
	return ref.current;
};

/** Define los posibles valores para la dificultad de una excursión. */
type DifficultyLevel = "Baja" | "Media" | "Alta";

/**
 * Determina las clases CSS para el badge de dificultad.
 */
const getDifficultyClasses = (difficultyLevel: DifficultyLevel): string => {
	const lowerCaseDifficulty =
		difficultyLevel.toLowerCase() as Lowercase<DifficultyLevel>;
	const classMap = {
		baja: styles.difficultyLow,
		media: styles.difficultyMedium,
		alta: styles.difficultyHigh,
	};

	return cn(styles.difficultyBadge, classMap[lowerCaseDifficulty]);
};

interface JoinButtonProps {
	/** Indica si el usuario se ha apuntado a la excursión. */
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
	if (isJoined) {
		return (
			<div className="d-grid d-md-flex justify-content-center justify-content-md-end">
				<output className={styles.joinedStatus}>
					<span>Apuntado/a</span>
				</output>
			</div>
		);
	}

	return (
		<div className="d-grid d-md-flex justify-content-md-end">
			<StyledButton
				onClick={onJoin}
				className={styles.joinButton}
				isLoading={isJoining}
			>
				{isJoining ? "Apuntando..." : "Apuntarse"}
			</StyledButton>
		</div>
	);
}

interface ExcursionCardProps {
	/** Identificador único de la excursión. */
	readonly id: string | number;
	/** Título o nombre descriptivo de la excursión. */
	readonly name: string;
	/** Ubicación geográfica o área donde se lleva a cabo la excursión. */
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
}

/**
 * Componente para la tarjeta de excursión.
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
}: ExcursionCardProps) {
	// La lógica para unirse a la excursión se encapsula en un hook personalizado para limpiar el componente y
	// hacerlo puramente presentacional.
	// Si onJoin no se proporciona, pasamos una función asíncrona vacía para satisfacer el tipado del hook y evitar errores
	// de TypeScript.
	const { isJoining, joinError, handleJoin, clearError } = useJoinExcursion(
		onJoin ?? (() => Promise.resolve())
	);

	// Estado para gestionar los mensajes que se anunciarán a los lectores de pantalla.
	const [announcement, setAnnouncement] = useState("");

	// Almacena el valor anterior de `isJoined` para evitar anuncios repetidos.
	const prevIsJoined = usePrevious(isJoined);

	// Genera un ID único y seguro para el título, que se usará para la accesibilidad.
	const titleId = useId();

	// Manejador para el evento de unirse a la excursión.
	const handleOnJoin = () => {
		handleJoin(id);
	};

	// Efecto para anunciar cambios de estado a los lectores de pantalla.
	useEffect(() => {
		if (isJoining) {
			setAnnouncement(`Apuntando a la excursión ${name}.`);
		}
	}, [isJoining, name]);

	// Efecto para anunciar el resultado (éxito o error) de la acción.
	// Usamos una referencia para saber si es la primera vez que el componente se monta.
	const isInitialMount = React.useRef(true);
	useEffect(() => {
		// Si es la primera vez que se monta, detiene la ejecución del efecto inmediatamente.
		// Esto evita anuncios innecesarios al cargar el componente.
		if (isInitialMount.current) {
			isInitialMount.current = false;
			return;
		}
		if (joinError) {
			setAnnouncement(`Error al apuntarse: ${getSafeErrorMessage(joinError)}.`);
		} else if (isJoined && !prevIsJoined) {
			// Solo anuncia el éxito cuando el estado cambia de no apuntado a apuntado.
			setAnnouncement(`Te has apuntado correctamente a la excursión ${name}.`);
		}
	}, [joinError, isJoined, prevIsJoined, name]);

	return (
		<Card
			as="fieldset"
			tabIndex={0}
			role="article"
			aria-labelledby={titleId}
			className={cn(styles.excursionItemCard, "h-100 w-100", {
				[styles.isJoinedCard]: isJoined,
			})}
		>
			{/* Contenedor para anuncios de accesibilidad, oculto visualmente. */}
			<div aria-live="polite" aria-atomic="true" className="visually-hidden">
				{announcement}
			</div>
			{/* Cuerpo de la tarjeta con detalles de la excursión y acciones. */}
			<Card.Body className="d-flex flex-column flex-grow-1">
				<div>
					{/* Título de la excursión */}
					<Card.Title
						/* `legend` proporciona un título semántico para su <fieldset> padre. */
						as="legend"
						id={titleId}
						className={`${styles.excursionTitle} mb-3`}
					>
						{name}
					</Card.Title>
					{/* Detalles de la excursión */}
					<div className={styles.excursionDetails}>
						<ExcursionDetailItem text={area} label="Zona" />
						<ExcursionDetailItem text={difficulty} label="Dificultad">
							<span className={getDifficultyClasses(difficulty)}>
								{difficulty}
							</span>
						</ExcursionDetailItem>
						<ExcursionDetailItem text={time} label="Tiempo estimado" />
					</div>
				</div>
				{/* Área de acción: botón para unirse a la excursión */}
				{isLoggedIn && (
					<div className={`${styles.cardActionArea} mt-auto pt-3`}>
						{joinError && (
							/* 
								Componente Alert para mostrar errores. El mensaje se sanitiza con `getSafeErrorMessage` 
								para prevenir inyección de HTML.
							*/
							<Alert
								variant="danger"
								onClose={clearError}
								dismissible
								className="mb-2 small"
								role="alert"
							>
								{getSafeErrorMessage(joinError)}
							</Alert>
						)}
						<JoinButton
							isJoined={isJoined}
							isJoining={isJoining}
							onJoin={handleOnJoin}
						/>
					</div>
				)}
			</Card.Body>
		</Card>
	);
}

export default ExcursionCard;
