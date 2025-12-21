import { Row, Col, Card, Form } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import userInfoStyles from "./UserInfoForm.module.css";

const SKELETON_INPUT_HEIGHT = 38;
const SKELETON_BUTTON_MIN_WIDTH = 70;
const SKELETON_ROWS_COUNT = 2;

/**
 * Renderiza un esqueleto para la tarjeta de información del usuario de la página de usuario.
 */
function UserInfoSkeleton(): React.ReactElement {
	return (
		<Card className={`${userInfoStyles.profileCard} w-100 flex-grow-1`}>
			<Card.Body className={`${userInfoStyles.cardBody} d-flex flex-column`}>
				{/* Header Skeleton */}
				<div className="mb-4">
					<Skeleton width="40%" height={24} className="mb-2" />
					<Skeleton width="60%" height={16} />
				</div>

				{/* Account Section Skeleton */}
				<div className="mb-4">
					<Skeleton width="15%" height={12} className="mb-3" />
					{/* Simula la fila de Correo (solo texto) */}
					<Row className="mb-0 gx-2 align-items-center">
						<Form.Label column sm={3} className="text-sm-end fw-bold">
							<Skeleton width="80%" />
						</Form.Label>
						<Col sm={9}>
							<Skeleton width="60%" />
						</Col>
					</Row>
				</div>

				<hr className="border-secondary-subtle my-4 opacity-25" />

				{/* Personal Info Section Skeleton */}
				<div>
					<Skeleton width="25%" height={12} className="mb-3" />
					{/* Simula 2 filas de etiqueta + input con margen estándar */}
					{Array.from({ length: SKELETON_ROWS_COUNT }).map((_, i) => (
						<Row
							// eslint-disable-next-line react/no-array-index-key
							key={`user-info-placeholder-row-${i}`}
							className="mb-3 gx-2 align-items-center"
						>
							<Form.Label column sm={3} className="text-sm-end fw-bold">
								<Skeleton width="80%" />
							</Form.Label>
							<Col sm={9}>
								<Skeleton height={SKELETON_INPUT_HEIGHT} />
							</Col>
						</Row>
					))}
					{/* Simula la última fila con un margen inferior mayor para separarla de los botones */}
					<Row className="mb-4 gx-2 align-items-center">
						<Form.Label column sm={3} className="text-sm-end fw-bold">
							<Skeleton width="80%" />
						</Form.Label>
						<Col sm={9}>
							<Skeleton height={SKELETON_INPUT_HEIGHT} />
						</Col>
					</Row>
				</div>
				<div className="mt-auto pt-3">
					<Row className="justify-content-sm-end gx-0">
						<Col xs={12} sm="auto">
							<Skeleton
								height={SKELETON_INPUT_HEIGHT}
								className="w-100"
								style={{ minWidth: SKELETON_BUTTON_MIN_WIDTH }}
							/>
						</Col>
					</Row>
				</div>
			</Card.Body>
		</Card>
	);
}

export default UserInfoSkeleton;
