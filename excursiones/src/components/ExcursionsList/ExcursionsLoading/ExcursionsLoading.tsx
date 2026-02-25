import { Row, Col } from "react-bootstrap";
import { SkeletonTheme } from "react-loading-skeleton";
import { useSkeletonTheme } from "../../../hooks/useSkeletonTheme";
import ExcursionCardSkeleton from "../../ExcursionCard/ExcursionCardSkeleton";

/**
 * Número de skeletons de tarjetas de excursión.
 */
const SKELETON_COUNT = 8;
/**
 * Array estático para iterar los skeletons.
 */
const SKELETON_ITEMS = Array.from({ length: SKELETON_COUNT });

/**
 * Componente para mostrar una animación de carga (esqueleto) mientras se obtienen las excursiones.
 */
export function ExcursionsLoading() {
	const skeletonThemeProps = useSkeletonTheme();

	return (
		<SkeletonTheme {...skeletonThemeProps}>
			<Row
				as="ul"
				className="gx-4 gy-5 list-unstyled"
				aria-label="Cargando excursiones"
				aria-busy="true"
			>
				{SKELETON_ITEMS.map((_, index) => (
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
