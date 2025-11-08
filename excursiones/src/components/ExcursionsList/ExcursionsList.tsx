import React, { useState, useEffect, useRef } from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { updateUser } from "../../slices/loginSlice";
import ExcursionCard from "../ExcursionCard";
import { joinExcursion as joinExcursionService } from "../../services/excursionService";
import ExcursionsLoading from "./ExcursionsLoading";
import ExcursionsError from "./ExcursionsError";
import NoExcursionsFound from "./NoExcursionsFound";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./ExcursionsList.module.css";
import { Excursion, User } from "../../types";

interface ExcursionsListProps {
	readonly excursionData?: Excursion[];
	readonly isLoading: boolean;
	readonly error: Error | null;
}

/**
 * Guarda de tipo para validar que un objeto es de tipo User.
 * Comprueba la existencia y el tipo de las propiedades esenciales.
 */
function isUser(obj: unknown): obj is User {
	return (
		typeof obj === "object" &&
		obj !== null &&
		"mail" in obj &&
		"excursions" in obj
	);
}
/**
 * Componente que orquesta la visualización de la lista de excursiones.
 * Gestiona los estados de carga, error y "no encontrado", renderizando el componente hijo apropiado.
 */
function ExcursionsList({
	excursionData = [],
	isLoading,
	error,
}: ExcursionsListProps) {
	// Se obtiene el estado del loginReducer, el objeto usuario y el token
	const {
		login: isLoggedIn,
		user,
		token,
	} = useSelector((state: RootState) => state.loginReducer);
	const loginDispatch = useDispatch<AppDispatch>();
	// Estado para las excursiones que se muestran. Esto nos permite mantener los resultados antiguos visibles mientras se
	// cargan los nuevos datos para evitar que parpadeen o se queden en blanco.
	const [displayedExcursions, setDisplayedExcursions] =
		useState<Excursion[]>(excursionData);
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
	 */
	const joinExcursion = async (excursionId: string | number) => {
		try {
			// Llamada al servicio para unirse a la excursión.
			const updatedUser = await joinExcursionService(
				user!.mail,
				String(excursionId), // Aseguramos que el ID sea un string para el servicio
				token
			);

			// Validamos que la respuesta de la API se ajuste a la interfaz User.
			if (isUser(updatedUser)) {
				// Si la validación es exitosa, actualizamos el estado global del usuario.
				loginDispatch(updateUser({ user: updatedUser }));
			} else {
				throw new Error("La respuesta de la API no tiene el formato esperado.");
			}
		} catch (caughtError: unknown) {
			// En desarrollo, muestra el error completo para facilitar la depuración.
			if (process.env.NODE_ENV === "development") {
				console.error("Error detallado (dev):", caughtError);
			} else {
				// En producción o test, registramos un mensaje controlado para no exponer detalles.
				console.error(
					"Error técnico al unirse a la excursión:",
					(caughtError as Error).message || "Error desconocido"
				);
			}
			// Relanzamos un nuevo error con un mensaje más amigable para el usuario.
			// Este error será capturado y mostrado por el componente ExcursionCard.
			throw new Error(
				"No ha sido posible apuntarse a la excursión. Por favor, inténtalo de nuevo más tarde."
			);
		}
	};

	/**
	 * Componentes de las tarjetas de excursión. El compilador de React se encargará de memoizar este cálculo si es necesario.
	 */
	const excursionComponents = displayedExcursions.map((excursion) => {
		const isJoined = !!(
			isLoggedIn && user?.excursions?.includes(String(excursion.id))
		);
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
	});

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

export default ExcursionsList;
