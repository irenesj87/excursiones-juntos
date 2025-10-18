import React, {
	useMemo,
	memo,
	useCallback,
	useState,
	useEffect,
	useRef,
} from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../../slices/loginSlice";
import ExcursionCard from "../ExcursionCard";
import { joinExcursion as joinExcursionService } from "../../services/excursionService";
import ExcursionsLoading from "./ExcursionsLoading";
import ExcursionsError from "./ExcursionsError";
import NoExcursionsFound from "./NoExcursionsFound";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./ExcursionsList.module.css";

/** @typedef {import('types.js').RootState} RootState */
/** @typedef {import('types.js').Excursion} Excursion */

/**
 * Componente que orquesta la visualización de la lista de excursiones.
 * Gestiona los estados de carga, error y "no encontrado", renderizando el componente hijo apropiado.
 * @param {object} props - Las propiedades del componente.
 * @param {Excursion[]} [props.excursionData] - Array de excursiones a mostrar. El valor por defecto es un array vacío.
 * @param {boolean} props.isLoading - Indica si los datos de las excursiones se están cargando.
 * @param {Error | null} props.error - Objeto de error si ha ocurrido un problema al cargar las excursiones. Se evalúa su veracidad.
 * @returns {React.ReactElement} El componente de la lista de excursiones.
 */
function ExcursionsListComponent({ excursionData = [], isLoading, error }) {
	// Se obtiene el estado del loginReducer, el objeto usuario y el token
	const {
		login: isLoggedIn,
		user,
		token,
	} = useSelector(
		/**
		 * @param {RootState} state - El estado global de Redux.
		 * @returns {{login: boolean, user: import('types.js').User | null, token: string | null}} - El estado del loginReducer.
		 */
		(state) => state.loginReducer
	);
	const loginDispatch = useDispatch();
	// Estado para las excursiones que se muestran. Esto nos permite mantener los resultados antiguos visibles mientras se
	// cargan los nuevos datos para evitar que parpadeen o se queden en blanco.
	const [displayedExcursions, setDisplayedExcursions] = useState(excursionData);
	// Estado para anunciar cambios a los lectores de pantalla.
	const [announcement, setAnnouncement] = useState("");
	// Referencia para saber si es la primera carga del componente. Permite evitar anunciar resultados en la primera carga.
	const isInitialLoad = useRef(true);

	// Efecto para gestionar qué excursiones se muestran. Se ejecuta cada vez que isLoading o excursionData cambian
	useEffect(() => {
		// No actualizamos nada mientras los datos se están cargando.
		// Esto mantiene los resultados antiguos visibles para una mejor UX,
		// por lo que solo actualizamos cuando la carga ha terminado.
		if (!isLoading) {
			setDisplayedExcursions(excursionData);
		}
	}, [isLoading, excursionData]);

	// Efecto separado para la accesibilidad. Se ejecuta solo cuando los datos de las excursiones cambian.
	useEffect(() => {
		// Anunciar el resultado de la búsqueda a los lectores de pantalla, pero solo después de la carga inicial para evitar
		// ruido innecesario.
		if (isInitialLoad.current) {
			isInitialLoad.current = false; // Marcar la carga inicial como completada.
			return;
		}
		if (excursionData.length > 0) {
			const plural = excursionData.length === 1 ? "excursión" : "excursiones";
			const message = `Búsqueda completada. Se han encontrado ${excursionData.length} ${plural}.`;
			setAnnouncement(message);
		}
	}, [excursionData]);

	/**
	 * Función asíncrona para unirse a una excursión.
	 * @param {string | number} excursionId - El ID de la excursión a la que el usuario desea unirse.
	 */
	const joinExcursion = useCallback(
		async (excursionId) => {
			try {
				// Llamada al servicio para unirse a la excursión.
				const updatedUser = await joinExcursionService(
					user?.mail,
					excursionId,
					token
				);
				// Actualiza el estado global del usuario con la nueva información.
				loginDispatch(updateUser({ user: updatedUser }));
			} catch (caughtError) {
				// En desarrollo, muestra el error completo para facilitar la depuración.
				if (process.env.NODE_ENV === "development") {
					console.error("Error detallado (dev):", caughtError);
				} else {
					// En producción o test, registramos un mensaje controlado para no exponer detalles.
					console.error(
						"Error técnico al unirse a la excursión:",
						caughtError.message || "Error desconocido"
					);
				}
				// Relanzamos un nuevo error con un mensaje más amigable para el usuario.
				// Este error será capturado y mostrado por el componente ExcursionCard.
				throw new Error(
					"No ha sido posible apuntarse a la excursión. Por favor, inténtalo de nuevo más tarde."
				);
			}
		},
		// `token` se añade como dependencia para asegurar que la función tiene la versión más reciente.
		[user?.mail, token, loginDispatch]
	);

	/**
	 * Componentes de las tarjetas de excursión, memoizados para optimizar el rendimiento, ya que el mapear un array a
	 * componentes puede ser costoso si hay muchas excursiones.
	 * Cada tarjeta recibe las propiedades necesarias y se encarga de mostrar la información de la excursión.
	 * Además, se comprueba si el usuario ha iniciado sesión y si ya está apuntado a la excursión para mostrar el botón
	 * de unirse o no.
	 */
	const excursionComponents = useMemo(
		() =>
			displayedExcursions.map((excursion) => {
				const isJoined = isLoggedIn && user?.excursions?.includes(excursion.id);
				return (
					<Col
						as="li"
						xs={12}
						md={6}
						lg={4}
						key={excursion.id}
						xl={3}
						className="d-flex" // d-flex para que las cards se estiren y ocupen toda la altura
					>
						<ExcursionCard
							{...excursion}
							isLoggedIn={isLoggedIn}
							isJoined={isJoined}
							onJoin={joinExcursion}
						/>
					</Col>
				);
			}),
		[displayedExcursions, isLoggedIn, user?.excursions, joinExcursion]
	);

	// --- Lógica de Renderizado Condicional ---
	// Si hay un error, mostrar el componente de error.
	if (error) {
		return <ExcursionsError />;
	}
	// Si las excursiones se están cargando y no hay excursiones, mostrar el esqueleto de carga.
	if (isLoading && displayedExcursions.length === 0) {
		return <ExcursionsLoading />;
	}
	// Si no se está cargando y no hay excursiones, mostrar el componente de "no encontrado".
	if (!isLoading && excursionData.length === 0) {
		return <NoExcursionsFound />;
	}
	// Por defecto, mostrar las excursiones.
	return (
		<div className={styles.excursionsContainer}>
			<output aria-live="polite" className="visually-hidden">
				{announcement}
			</output>
			<h2 className={styles.title}>Próximas excursiones</h2>
			<Row as="ul" className="gx-4 gy-5 list-unstyled">
				{excursionComponents}
			</Row>
		</div>
	);
}

const ExcursionsList = memo(ExcursionsListComponent);
export default ExcursionsList;
