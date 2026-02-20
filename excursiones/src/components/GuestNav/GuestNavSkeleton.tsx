import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSkeletonTheme } from "../../hooks/useSkeletonTheme";

export const GUEST_NAV_SKELETON_SIZES = {
	LOGIN_LINK_WIDTH: 120, 
	HEIGHT: 42,
	BORDER_RADIUS: "4px",
};

/**
 * Componente que muestra un esqueleto de carga para los botones de navegación de un usuario invitado.
 */
function GuestNavSkeleton(): JSX.Element {
	// Obtiene los colores del esqueleto de forma centralizada a través del hook.
	const { baseColor, highlightColor } = useSkeletonTheme();

	return (
		<SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
			{/* Usamos un contenedor Flexbox para asegurar que los esqueletos se alineen horizontalmente,
			    imitando el comportamiento de los enlaces de navegación finales. */}
			<div
				className="d-flex align-items-center"
				data-testid="guest-nav-skeleton"
			>
				{/* Esqueleto para el enlace de inicio de sesión */}
				<Skeleton
					width={GUEST_NAV_SKELETON_SIZES.LOGIN_LINK_WIDTH}
					height={GUEST_NAV_SKELETON_SIZES.HEIGHT}
					aria-hidden="true"
					borderRadius={GUEST_NAV_SKELETON_SIZES.BORDER_RADIUS}
				/>
			</div>
		</SkeletonTheme>
	);
}

export default GuestNavSkeleton;
