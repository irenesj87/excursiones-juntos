import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSkeletonTheme } from "../../hooks/useSkeletonTheme";

// Define placeholder dimensions as constants to avoid magic numbers and improve maintainability.
export const GUEST_NAV_SKELETON_SIZES = {
	// Ajustados para reflejar de forma más precisa el tamaño real de los botones y minimizar el CLS.
	REGISTER_LINK_WIDTH: 142, // +28px por el icono
	LOGIN_LINK_WIDTH: 157, // +28px por el icono
	HEIGHT: 44,
	BORDER_RADIUS: "50rem",
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
				<Skeleton
					width={GUEST_NAV_SKELETON_SIZES.REGISTER_LINK_WIDTH}
					height={GUEST_NAV_SKELETON_SIZES.HEIGHT}
					aria-hidden="true"
					borderRadius={GUEST_NAV_SKELETON_SIZES.BORDER_RADIUS}
					className="me-2" // Aplica el margen directamente al esqueleto
				/>
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
