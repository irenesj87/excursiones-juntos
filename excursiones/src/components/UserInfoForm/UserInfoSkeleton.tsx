import { Row, Col, Card } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import { useSkeletonTheme } from "../../hooks/useSkeletonTheme";
import userInfoStyles from "./UserInfoForm.module.css";

const SKELETON_INPUT_HEIGHT = 38;
const SKELETON_BUTTON_HEIGHT = 44;
const SKELETON_BUTTON_MIN_WIDTH = 100;
const SKELETON_BORDER_RADIUS = 6;
const SKELETON_ROWS_COUNT = 2;
const BUTTON_SKELETON_STYLE = {
	minWidth: SKELETON_BUTTON_MIN_WIDTH,
};

/**
 * Componente que renderiza un esqueleto (skeleton) para la tarjeta de información del usuario.
 */
function UserInfoSkeleton(): React.ReactElement {
	const { baseColor, highlightColor } = useSkeletonTheme();

	return (
		<Card className={`${userInfoStyles.profileCard} w-100 flex-grow-1`}>
			<Card.Body className={`${userInfoStyles.cardBody} d-flex flex-column`}>
				{/* Header */}
				<div className="d-flex flex-column flex-sm-row align-items-center gap-3 gap-sm-4 mb-4">
					<Skeleton
						circle
						width={96}
						height={96}
						className="flex-shrink-0"
						baseColor={baseColor}
						highlightColor={highlightColor}
					/>
					<div className="w-100 text-center text-sm-start">
						<Skeleton
							width="40%"
							height={32}
							className="mb-2"
							borderRadius={SKELETON_BORDER_RADIUS}
							baseColor={baseColor}
							highlightColor={highlightColor}
						/>
						<Skeleton
							width="60%"
							baseColor={baseColor}
							highlightColor={highlightColor}
						/>
					</div>
				</div>

				{/* Información de la cuenta */}
				<div className="mb-4">
					<Skeleton
						width="15%"
						height={24}
						className="mb-3"
						baseColor={baseColor}
						highlightColor={highlightColor}
					/>
					{/* Correo */}
					<div className="mb-0">
						<div className="mb-2">
							<Skeleton
								width="60px"
								baseColor={baseColor}
								highlightColor={highlightColor}
							/>
						</div>
						<Skeleton
							width="40%"
							baseColor={baseColor}
							highlightColor={highlightColor}
						/>
					</div>
				</div>

				<hr className="border-secondary-subtle my-4 opacity-25" />

				{/* Información personal */}
				<div>
					<Skeleton
						width="25%"
						height={24}
						className="mb-3"
						baseColor={baseColor}
						highlightColor={highlightColor}
					/>
					{/* Simula 2 filas de etiqueta + input con margen estándar */}
					{Array.from({ length: SKELETON_ROWS_COUNT }).map((_, i) => (
						<div
							// eslint-disable-next-line react/no-array-index-key
							key={`user-info-placeholder-row-${i}`}
							className="mb-3"
						>
							<div className="mb-2">
								<Skeleton
									width="80px"
									baseColor={baseColor}
									highlightColor={highlightColor}
								/>
							</div>
							<Skeleton
								height={SKELETON_INPUT_HEIGHT}
								borderRadius={SKELETON_BORDER_RADIUS}
								baseColor={baseColor}
								highlightColor={highlightColor}
							/>
						</div>
					))}
					{/* Simula la última fila con un margen inferior mayor para separarla de los botones */}
					<div className="mb-4">
						<div className="mb-2">
							<Skeleton
								width="100px"
								baseColor={baseColor}
								highlightColor={highlightColor}
							/>
						</div>
						<Skeleton
							height={SKELETON_INPUT_HEIGHT}
							borderRadius={SKELETON_BORDER_RADIUS}
							baseColor={baseColor}
							highlightColor={highlightColor}
						/>
					</div>
				</div>
				<div className="mt-auto pt-3">
					<Row className="justify-content-sm-end gx-0">
						<Col xs={12} sm="auto">
							<Skeleton
								height={SKELETON_BUTTON_HEIGHT}
								borderRadius={SKELETON_BORDER_RADIUS}
								className="w-100"
								style={BUTTON_SKELETON_STYLE}
								baseColor={baseColor}
								highlightColor={highlightColor}
							/>
						</Col>
					</Row>
				</div>
			</Card.Body>
		</Card>
	);
}

export default UserInfoSkeleton;
