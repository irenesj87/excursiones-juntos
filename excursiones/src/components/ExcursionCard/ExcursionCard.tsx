import React from "react";
import { Card } from "react-bootstrap";
import ExcursionDetailItem from "../ExcursionDetailItem";
import ErrorMessageAlert from "../ErrorMessageAlert/ErrorMessageAlert";
import type { DifficultyLevel } from "../../types";
import StyledButton from "../StyledButton";
import { useJoinExcursion } from "../../hooks/useJoinExcursion";
import { getSafeErrorMessage } from "../../utils/errorUtils";
import { MapIcon, ChartIcon, ClockIcon, CheckIcon } from "../shared/Icons";
import cn from "classnames";
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
	return (
		<div className="d-grid d-md-flex justify-content-md-end">
			{isJoined ? (
				<span className={styles.joinedStatus} role="status">
					<span>
						<CheckIcon className={styles.detailIcon} />
						Apuntado/a
					</span>
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
		<Card as="article" className={cn(styles.excursionItemCard, "h-100 w-100")}>
			{/* Cuerpo de la tarjeta con detalles de la excursión y acciones. */}
			<Card.Body className="d-flex flex-column flex-grow-1">
				<div>
					{/* Título de la excursión */}
					<Card.Title as="h3" className={styles.excursionTitle}>
						{name}
					</Card.Title>
					{/* Detalles de la excursión */}
					<div className={styles.excursionDetails}>
						<ExcursionDetailItem
							text={area}
							label="Zona"
							icon={<MapIcon className={styles.detailIcon} />}
						/>
						<ExcursionDetailItem
							text={difficulty}
							label="Dificultad"
							icon={<ChartIcon className={styles.detailIcon} />}
						/>
						<ExcursionDetailItem
							text={time}
							label="Tiempo estimado"
							icon={<ClockIcon className={styles.detailIcon} />}
						/>
					</div>
				</div>
				{/* Área de acción: botón para unirse a la excursión */}
				{isLoggedIn && (
					<div className="mt-auto">
						{/* Separador visual sutil antes de las acciones */}
						<hr className="border-secondary-subtle my-3 opacity-25" />
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
