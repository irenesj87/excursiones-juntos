import React from "react";
import { useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { SkeletonTheme } from "react-loading-skeleton";
import { useSkeletonTheme } from "../../../hooks/useSkeletonTheme";
import ExcursionCardSkeleton from "../../ExcursionCard/ExcursionCardSkeleton";
import styles from "./ExcursionsLoading.module.css";
import { RootState } from "../../../store/store";

/**
 * Número de skeletons de tarjetas de excursión.
 */
const SKELETON_COUNT = 8;

/**
 * Componente para mostrar una animación de carga (esqueleto) mientras se obtienen las excursiones.
 */
function ExcursionsLoading() {
	const isLoggedIn = useSelector(
		(state: RootState) => state.loginReducer.login
	);

	const skeletonThemeProps = useSkeletonTheme();

	return (
		<SkeletonTheme {...skeletonThemeProps}>
			<div className={styles.excursionsContainer}>
				<h2 className={styles.title}>Próximas excursiones</h2>
				<Row as="ul" className="gx-4 gy-5 list-unstyled">
					{Array.from({ length: SKELETON_COUNT }).map((_, index) => (
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
}

export default ExcursionsLoading;
