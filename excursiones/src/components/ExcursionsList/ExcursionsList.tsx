import { Row, Col } from "react-bootstrap";
import { ExcursionCard } from "../ExcursionCard";
import { ExcursionsLoading } from "./ExcursionsLoading";
import { FeedbackAlert } from "../../ui/FeedbackAlert";
import { NoExcursionsFound } from "./NoExcursionsFound";
import styles from "./ExcursionsList.module.css";
import {
	useExcursionsListLogic,
	ExcursionsListProps,
	ExcursionsListViewProps,
} from "./useExcursionsListLogic";

const TEXTS = {
	TITLE: "Próximas excursiones",
	ERROR_MESSAGE: "Lo sentimos, ha ocurrido un error al cargar las excursiones.",
} as const;

/**
 * Este componente se encarga de mostrar las excursiones.
 */
export function ExcursionsListView({
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
			return (
				<div className="d-flex justify-content-center my-5">
					<FeedbackAlert variant="danger" message={TEXTS.ERROR_MESSAGE} />
				</div>
			);
		}
		// 3. Prioridad: Estado vacío.
		if (excursions.length === 0) {
			return <NoExcursionsFound />;
		}

		return (
			<Row as="ul" className="gx-4 gy-5 list-unstyled">
				{excursions.map((excursion, index) => {
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
							className={`d-flex ${styles.cardItem}`}
							style={
								{
									"--animation-order": index,
								} as React.CSSProperties
							}
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
				{TEXTS.TITLE}
			</h2>
			{renderContent()}
		</section>
	);
}

/**
 * Componente Principal (Container).
 * Conecta la lógica (Hook) con la Vista (Componente).
 */
export function ExcursionsList(props: Readonly<ExcursionsListProps>) {
	const viewProps = useExcursionsListLogic(props);

	return <ExcursionsListView {...viewProps} />;
}
