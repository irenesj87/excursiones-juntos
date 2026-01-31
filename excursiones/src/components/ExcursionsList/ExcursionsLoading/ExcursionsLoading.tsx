import React from "react";
import { Row, Col } from "react-bootstrap";
import { SkeletonTheme } from "react-loading-skeleton";
import { useSkeletonTheme } from "../../../hooks/useSkeletonTheme";
import ExcursionCardSkeleton from "../../ExcursionCard/ExcursionCardSkeleton";


/**
 * Número de skeletons de tarjetas de excursión.
 */
const SKELETON_COUNT = 8;

/**
 * Componente para mostrar una animación de carga (esqueleto) mientras se obtienen las excursiones.
 */
function ExcursionsLoading() {
	

	const skeletonThemeProps = useSkeletonTheme();

	return (
		<SkeletonTheme {...skeletonThemeProps}>
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
						<ExcursionCardSkeleton />
					</Col>
				))}
			</Row>
		</SkeletonTheme>
	);
}

export default ExcursionsLoading;
