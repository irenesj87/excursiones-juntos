import React from "react";
import { useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { SkeletonTheme } from "react-loading-skeleton";
import { useSkeletonTheme } from "../../../hooks/useSkeletonTheme";
import ExcursionCardSkeleton from "../../ExcursionCard/ExcursionCardSkeleton";
import styles from "./ExcursionsLoading.module.css";
import { RootState } from "../../../store/store";

/**
 * Componente para mostrar una animación de carga (esqueleto) mientras se obtienen las excursiones.
 */
const ExcursionsLoading = () => {
	const isLoggedIn = useSelector(
		(state: RootState) => state.loginReducer.login
	);

	// Obtener las propiedades del tema para los esqueletos
	const skeletonThemeProps = useSkeletonTheme();

	// Renderizar la lista de esqueletos de tarjetas de excursión
	return (
		<SkeletonTheme {...skeletonThemeProps}>
			<div className={styles.excursionsContainer}>
				<h2 className={styles.title}>Próximas excursiones</h2>
				<output aria-live="polite" className="visually-hidden">
					Cargando excursiones...
				</output>
				<Row as="ul" className="gx-4 gy-5 list-unstyled">
					{Array.from({ length: 8 }).map((_, index) => (
						<Col
							as="li"
							xs={12}
							md={6}
							lg={4}
							xl={3}
							// eslint-disable-next-line react/no-array-index-key
							key={`skeleton-card-${index}`}
							className="d-flex"
						>
							<ExcursionCardSkeleton isLoggedIn={isLoggedIn} />
						</Col>
					))}
				</Row>
			</div>
		</SkeletonTheme>
	);
};

export default ExcursionsLoading;
