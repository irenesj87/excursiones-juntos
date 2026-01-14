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
	if (error) {
		return <ExcursionsError />;
	}

	// Si no hay excursiones que mostrar
	if (excursions.length === 0)
		return isLoading ? <ExcursionsLoading /> : <NoExcursionsFound />;

	const excursionComponents = excursions.map((excursion) => {
		const isJoined = isLoggedIn && joinedExcursionIds.has(String(excursion.id));

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
	});

	return (
		<div className={styles.excursionsContainer}>
			<h2 className={styles.title}>Próximas excursiones</h2>
			<Row as="ul" className="gx-4 gy-5 list-unstyled">
				{excursionComponents}
			</Row>
		</div>
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
