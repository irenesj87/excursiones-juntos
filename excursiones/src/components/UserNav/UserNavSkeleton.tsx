import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSkeletonTheme } from "../../hooks/useSkeletonTheme";

// Define placeholder dimensions as constants to avoid magic numbers and improve maintainability.
const USER_NAV_SKELETON_SIZES = {
	PROFILE_LINK_WIDTH: 127, // +28px por el icono
	LOGOUT_BUTTON_WIDTH: 160, // +28px por el icono
	HEIGHT: 44,
	BORDER_RADIUS: "50rem",
};

/**
 * Componente que muestra un esqueleto de carga para los botones de navegación de un usuario logueado.
 */
function UserNavSkeleton() {
	// Obtiene los colores del esqueleto de forma centralizada a través del hook.
	const { baseColor, highlightColor } = useSkeletonTheme();

	return (
		<SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
			<div
				className="d-flex justify-content-end align-items-center"
				aria-hidden="true"
			>
				{/* Placeholder para el enlace "Perfil" */}
				<Skeleton
					width={USER_NAV_SKELETON_SIZES.PROFILE_LINK_WIDTH}
					height={USER_NAV_SKELETON_SIZES.HEIGHT}
					borderRadius={USER_NAV_SKELETON_SIZES.BORDER_RADIUS}
					className="me-3"
				/>
				{/* Placeholder para el botón "Cerrar sesión" */}
				<Skeleton
					width={USER_NAV_SKELETON_SIZES.LOGOUT_BUTTON_WIDTH}
					height={USER_NAV_SKELETON_SIZES.HEIGHT}
					borderRadius={USER_NAV_SKELETON_SIZES.BORDER_RADIUS}
				/>
			</div>
		</SkeletonTheme>
	);
}

export default UserNavSkeleton;
