import React from "react";
import { Card, Alert } from "react-bootstrap";
import ExcursionDetailItem from "../ExcursionDetailItem";
import type { DifficultyLevel } from "../../types";
import StyledButton from "../StyledButton";
import { useJoinExcursion } from "../../hooks/useJoinExcursion";
import { getSafeErrorMessage } from "../../utils/errorUtils";
import { MapIcon, ChartIcon, ClockIcon } from "../shared/Icons";
import cn from "classnames";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./ExcursionCard.module.css";

/**
 * Props del botón para unirse a una excursión.
 */
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
}

/**
 * Componente que se encarga de renderizar un tarjeta que muestra la información de una excursión y permite a los usuarios
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

	return (
		<Card
			as="article"
			className={cn(styles.excursionItemCard, "h-100 w-100", {
				[styles.isJoinedCard]: isJoined,
			})}
		>
			{/* Cuerpo de la tarjeta con detalles de la excursión y acciones. */}
			<Card.Body className="d-flex flex-column flex-grow-1">
				<div>
					{/* Título de la excursión */}
					<Card.Title className={`${styles.excursionTitle} mb-3`}>
						{name}
					</Card.Title>
					{/* Detalles de la excursión */}
					<div className={styles.excursionDetails}>
						<ExcursionDetailItem
							text={area}
							label="Zona"
							icon={<MapIcon className={styles.icon} />}
						/>
						<ExcursionDetailItem
							text={difficulty}
							label="Dificultad"
							icon={<ChartIcon className={styles.icon} />}
						/>
						<ExcursionDetailItem
							text={time}
							label="Tiempo estimado"
							icon={<ClockIcon className={styles.icon} />}
						/>
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
