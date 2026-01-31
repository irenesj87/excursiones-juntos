import React from "react";
import { Row, Col } from "react-bootstrap";
import ExcursionCard from "../ExcursionCard";
import ExcursionsLoading from "./ExcursionsLoading";
import ExcursionsError from "./ExcursionsError";
import NoExcursionsFound from "./NoExcursionsFound";
import styles from "./ExcursionsList.module.css";
import {
	useExcursionsListLogic,
	ExcursionsListProps,
	ExcursionsListViewProps,
} from "./useExcursionsListLogic";

/**
 * Este componente se encarga de mostrar las excursiones.
 */
function ExcursionsListView({
	excursions,
	isLoading,
	error,
	isLoggedIn,
	joinedExcursionIds,
	onJoin,
}: Readonly<ExcursionsListViewProps>) {
	const renderContent = () => {
		// 1. Prioridad: Carga inicial.
		// Si está cargando y no hay datos, mostramos el esqueleto para evitar parpadeos.
		if (isLoading && excursions.length === 0) {
			return <ExcursionsLoading />;
		}
		// 2. Prioridad: Error.
		if (error) {
			return <ExcursionsError />;
		}
		// 3. Prioridad: Estado vacío.
		if (excursions.length === 0) {
			return <NoExcursionsFound />;
		}

		return (
			<Row as="ul" className="gx-4 gy-5 list-unstyled">
				{excursions.map((excursion) => {
					const isJoined =
						isLoggedIn && joinedExcursionIds.has(String(excursion.id));

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
								id={excursion.id}
								name={excursion.name}
								description={excursion.description}
								area={excursion.area}
								difficulty={excursion.difficulty}
								time={excursion.time}
								imgSrc={excursion.imgSrc}
								imgAlt={excursion.imgAlt}
								isLoggedIn={isLoggedIn}
								isJoined={isJoined}
								onJoin={onJoin}
							/>
						</Col>
					);
				})}
			</Row>
		);
	};

	return (
		<section
			className={styles.excursionsContainer}
			aria-labelledby="excursions-list-title"
		>
			<h2 id="excursions-list-title" className={styles.title}>
				Próximas Excursiones
			</h2>
			{renderContent()}
		</section>
	);
}

/**
 * Componente Principal (Container).
 * Conecta la lógica (Hook) con la Vista (Componente).
 */
function ExcursionsList(props: Readonly<ExcursionsListProps>) {
	const viewProps = useExcursionsListLogic(props);

	return <ExcursionsListView {...viewProps} />;
}

export default ExcursionsList;
