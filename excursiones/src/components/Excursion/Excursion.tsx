import React from "react";
import { Container } from "react-bootstrap";
import { Link, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ErrorMessageAlert from "../ErrorMessageAlert/ErrorMessageAlert";
import StyledButton from "../StyledButton";
import {
	NoImageIcon,
	CheckIcon,
	ArrowLeftIcon,
	LockIcon,
} from "../shared/Icons";
import { API } from "../../constants";
import {
	getExcursionById,
	checkIsUserJoined,
} from "../../services/excursionService";
import type { Excursion as ExcursionType } from "../../types";
import { useSkeletonTheme } from "../../hooks/useSkeletonTheme";
import { useMinDisplayTime } from "../../hooks/useMinDisplayTime";
import ExcursionSkeleton from "./ExcursionSkeleton";
import styles from "./Excursion.module.css";

// --- Tipos y Helpers (Podrían extraerse a archivos compartidos) ---
import { RootState } from "../../store/store";

// Extendemos el tipo base para evitar duplicar definiciones (Guideline 4)
interface ExcursionData extends ExcursionType {
	isJoined: boolean; // Estado local añadido
}

interface ExcursionPageProps {
	/** Datos de la excursión (idealmente vendrían de un hook useExcursion(id)) */
	readonly excursion?: ExcursionData;
	readonly isLoggedIn: boolean;
	/** Función para recargar los datos o manejar la acción global */
	readonly onJoinAction?: (id: string | number) => Promise<void>;
}

function resolveImageBaseUrl(src?: string): string {
	if (!src) return "";
	const fullPath = src.startsWith("http") ? src : `${API.BASE_URL}${src}`;
	return fullPath.replace(/\.(jpe?g|png|webp|avif)$/i, "");
}

/**
 * Página de detalle de la excursión.
 * Aquí es donde ahora vive la lógica para apuntarse.
 */
function Excursion({
	excursion: propExcursion,
	isLoggedIn,
	onJoinAction,
}: ExcursionPageProps) {
	const location = useLocation();
	const { id } = useParams<{ id: string }>();

	// Obtenemos el usuario del store para verificar si está apuntado al recargar
	const user = useSelector((state: RootState) => state.loginReducer.user);
	const token = useSelector((state: RootState) => state.loginReducer.token);

	const { baseColor, highlightColor } = useSkeletonTheme();

	// Unificamos el estado de la excursión para poder actualizarlo localmente (ej. al apuntarse)
	// Inicializamos con lo que tengamos disponible (props o state del router)
	const [excursion, setExcursion] = React.useState<ExcursionData | undefined>(
		propExcursion || location.state?.excursion,
	);

	const [isLoading, setIsLoading] = React.useState(!excursion);
	const [error, setError] = React.useState<string | null>(null);
	const [isJoining, setIsJoining] = React.useState(false);
	const [joinError, setJoinError] = React.useState<string | null>(null);

	// Estado para controlar la carga de los detalles (descripción y estado de unión)
	// Se inicializa a true si tenemos la excursión pero falta la descripción (navegación desde lista)
	const [isDetailsLoading, setIsDetailsLoading] = React.useState(
		() => !!(excursion && !excursion.description),
	);

	const { startTiming, dispatchWithMinDisplayTime: setDetailsLoadingSafe } =
		useMinDisplayTime(setIsDetailsLoading, 500);

	// Efecto para cargar datos si no tenemos la excursión
	React.useEffect(() => {
		// Si ya tenemos la excursión completa (con descripción), no hacemos fetch
		if (excursion?.description !== undefined || !id) return;

		startTiming();

		// Solo mostramos el spinner si no tenemos ningún dato de la excursión
		if (excursion) {
			// Si tenemos excursión parcial, activamos carga de detalles
			setIsDetailsLoading(true);
		} else {
			setIsLoading(true);
		}

		// Cargamos los datos de la excursión y, si hay usuario, verificamos si está apuntado
		const fetchData = async () => {
			try {
				const [excursionData, isJoined] = await Promise.all([
					getExcursionById(id),
					user && token
						? checkIsUserJoined(user.mail, id, token)
						: Promise.resolve(false),
				]);

				setExcursion({
					...excursionData,
					description: excursionData.description ?? "",
					isJoined,
				});
			} catch (err) {
				console.error(err);
				setError("Error al cargar los detalles.");
			} finally {
				setIsLoading(false);
				setDetailsLoadingSafe(false);
			}
		};

		fetchData();
	}, [id, excursion, user, token, startTiming, setDetailsLoadingSafe]);

	const handleOnJoin = async () => {
		if (!onJoinAction || !excursion) return;

		setIsJoining(true);
		setJoinError(null);

		// 1. Actualización Optimista: Marcamos como unido INMEDIATAMENTE para que la UI responda al instante
		setExcursion((prev) => (prev ? { ...prev, isJoined: true } : prev));

		try {
			await onJoinAction(excursion.id);
		} catch (err) {
			// 2. Si falla la API, revertimos el cambio para que el usuario pueda reintentar
			setExcursion((prev) => (prev ? { ...prev, isJoined: false } : prev));
			setJoinError(
				err instanceof Error ? err.message : "Error al unirse a la excursión",
			);
		} finally {
			setIsJoining(false);
		}
	};

	if (isLoading) {
		return <ExcursionSkeleton />;
	}

	if (error || !excursion) {
		return (
			<Container className="py-5 text-center">
				<ErrorMessageAlert
					message={error || "Excursión no encontrada"}
					onClose={() => setError(null)}
				/>
				<Link to="/excursions" className="btn btn-outline-primary mt-3">
					Volver al listado
				</Link>
			</Container>
		);
	}

	const imageBaseUrl = resolveImageBaseUrl(excursion.imgSrc);

	const renderJoinAction = () => {
		if (isDetailsLoading) {
			return <Skeleton height={48} borderRadius={50} />;
		}

		if (!isLoggedIn) {
			return (
				<div className="text-center text-muted mb-0 d-flex align-items-center justify-content-center gap-2">
					<LockIcon size={16} />
					<span>Debes iniciar sesión para apuntarte.</span>
				</div>
			);
		}

		if (excursion.isJoined) {
			return (
				<div className={styles.joinedBadge}>
					<CheckIcon size={20} />
					<span>¡Ya estás apuntado/a!</span>
				</div>
			);
		}

		return (
			<StyledButton
				onClick={handleOnJoin}
				isLoading={isJoining}
				variant="primary"
				className="btn-lg w-100"
			>
				Apuntarse ahora
			</StyledButton>
		);
	};

	return (
		<SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
			<article className={styles.excursionPage}>
				<Container className={styles.pageContainer}>
					<div className={styles.panel}>
						{/* PANEL IZQUIERDO: Imagen + Título Superpuesto */}
						<div className={styles.leftPanel}>
							<div className={styles.imageContainer}>
								{imageBaseUrl ? (
									<picture>
										<source srcSet={`${imageBaseUrl}.webp`} type="image/webp" />
										<img
											src={`${imageBaseUrl}.jpg`}
											alt={excursion.name}
											className={styles.heroImage}
											width="800"
											height="1000"
										/>
									</picture>
								) : (
									<div className={styles.imageFallback}>
										<NoImageIcon size={64} />
									</div>
								)}
								<div className={styles.heroOverlay} />
							</div>

							<div className={styles.heroContent}>
								<Link to="/excursions" className={styles.backLink}>
									<ArrowLeftIcon /> Volver
								</Link>
								<h1 className={styles.title}>{excursion.name}</h1>
								<ul className={styles.metaTags}>
									<li className={styles.tag}>{excursion.area}</li>
									<li className={styles.tag}>{excursion.difficulty}</li>
									<li className={styles.tag}>{excursion.time}</li>
								</ul>
							</div>
						</div>

						{/* PANEL DERECHO: Descripción + Acción */}
						<div className={styles.rightPanel}>
							<div className={styles.descriptionWrapper}>
								<h2 className={`h4 mb-4 ${styles.sectionTitle}`}>
									Acerca de esta excursión
								</h2>
								{isDetailsLoading ? (
									<div aria-hidden="true">
										<Skeleton count={3} />
										<Skeleton width="80%" />
									</div>
								) : (
									<p className={styles.description}>
										{excursion.description ||
											"Disfruta de una experiencia única en la naturaleza. Esta ruta ofrece vistas espectaculares y un recorrido adaptado a su nivel de dificultad. No olvides llevar agua y calzado adecuado."}
									</p>
								)}
							</div>

							<div className={styles.actionWrapper}>
								{joinError && (
									<ErrorMessageAlert
										message={joinError}
										onClose={() => setJoinError(null)}
										className="mb-3 small"
									/>
								)}

								{renderJoinAction()}
							</div>
						</div>
					</div>
				</Container>
			</article>
		</SkeletonTheme>
	);
}

export default Excursion;
