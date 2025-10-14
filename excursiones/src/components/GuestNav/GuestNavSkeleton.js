import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSkeletonTheme } from "../../hooks/useSkeletonTheme";

// Define placeholder dimensions as constants to avoid magic numbers and improve maintainability.
export const GUEST_NAV_SKELETON_SIZES = {
	REGISTER_LINK_WIDTH: 97,
	LOGIN_LINK_WIDTH: 129,
	HEIGHT: 44,
};

/**
 * Componente que muestra un esqueleto de carga para los botones de navegación de un usuario invitado.
 * @returns {React.ReactElement} - El esqueleto de navegación para usuarios invitados.
 */
function GuestNavSkeleton() {
	// Obtiene los colores del esqueleto de forma centralizada a través del hook.
	const { baseColor, highlightColor } = useSkeletonTheme();

	return (
		<SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
			<div
				className="d-flex align-items-center"
				aria-hidden="true"
				data-testid="guest-nav-skeleton"
			>
				{/* Placeholder para el enlace "Regístrate" */}
				<Skeleton
					width={GUEST_NAV_SKELETON_SIZES.REGISTER_LINK_WIDTH}
					height={GUEST_NAV_SKELETON_SIZES.HEIGHT}
					className="me-3"
				/>
				{/* Placeholder para el enlace "Inicia sesión" */}
				<Skeleton
					width={GUEST_NAV_SKELETON_SIZES.LOGIN_LINK_WIDTH}
					height={GUEST_NAV_SKELETON_SIZES.HEIGHT}
				/>
			</div>
		</SkeletonTheme>
	);
}

export default GuestNavSkeleton;
