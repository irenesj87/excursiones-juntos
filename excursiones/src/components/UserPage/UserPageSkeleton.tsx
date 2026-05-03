import { Row, Col } from "react-bootstrap";
import { SkeletonTheme } from "react-loading-skeleton";
import UserInfoSkeleton from "../UserInfoForm/UserInfoSkeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSkeletonTheme } from "../../hooks/useSkeletonTheme";

/**
 * Componente que muestra un esqueleto de carga para la página de perfil de usuario.
 */
function UserPageSkeleton(): JSX.Element {
	const { baseColor, highlightColor } = useSkeletonTheme();

	return (
		<SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
			<Row
				as="main"
				className="justify-content-center pt-5 h-100"
				aria-hidden="true"
			>
				<Col xs={11} md={11} lg={11} xl={8} className="d-flex flex-column pb-5">
					<UserInfoSkeleton />
				</Col>
			</Row>
		</SkeletonTheme>
	);
}

export default UserPageSkeleton;
