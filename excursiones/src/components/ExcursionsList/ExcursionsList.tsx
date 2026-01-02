import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import ExcursionCard from "../ExcursionCard";
import ExcursionsLoading from "./ExcursionsLoading";
import ExcursionsError from "./ExcursionsError";
import NoExcursionsFound from "./NoExcursionsFound";
import styles from "./ExcursionsList.module.css";
import { Excursion } from "../../types";
import { useJoinExcursionAction } from "./useJoinExcursionAction";

interface ExcursionsListProps {
	readonly excursionData?: readonly Excursion[];
	readonly isLoading: boolean;
	readonly error: Error | null;
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
	const { login: isLoggedIn, user } = useSelector(
		(state: RootState) => state.loginReducer
	);
	const { joinExcursion } = useJoinExcursionAction();

	// Mantenemos los resultados antiguos visibles mientras cargan los nuevos para evitar parpadeos (UX).
	const [displayedExcursions, setDisplayedExcursions] =
		useState<readonly Excursion[]>(excursionData);

	useEffect(() => {
		if (!isLoading) {
			setDisplayedExcursions(excursionData);
		}
	}, [isLoading, excursionData]);

	const handleJoinExcursion = async (excursionId: string | number) => {
		try {
			await joinExcursion(excursionId);
		} catch (caughtError: unknown) {
			if (process.env.NODE_ENV === "development") {
				console.error("Error detallado (dev):", caughtError);
			}
			// El componente hijo espera un error para mostrar feedback visual.
			throw new Error(
				"No ha sido posible apuntarse a la excursión. Por favor, inténtalo de nuevo más tarde."
			);
		}
	};

	// El compilador de React se encargará de memoizar este cálculo si es necesario.
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
				className="d-flex"
			>
				<ExcursionCard
					{...excursion}
					isLoggedIn={isLoggedIn}
					isJoined={isJoined}
					onJoin={handleJoinExcursion}
				/>
			</Col>
		);
	});

	if (error) {
		return <ExcursionsError />;
	}

	if (isLoading && displayedExcursions.length === 0) {
		return <ExcursionsLoading />;
	}
	if (!isLoading && excursionData.length === 0) {
		return <NoExcursionsFound />;
	}
	return (
		<div className={styles.excursionsContainer}>
			<h2 className={styles.title}>Próximas excursiones</h2>
			<Row as="ul" className="gx-4 gy-5 list-unstyled">
				{excursionComponents}
			</Row>
		</div>
	);
}

export default ExcursionsList;
