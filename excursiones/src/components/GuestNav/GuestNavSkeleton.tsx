import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSkeletonTheme } from "../../hooks/useSkeletonTheme";

export const GUEST_NAV_SKELETON_SIZES = {
	LOGIN_LINK_WIDTH: 145,
	ICON_SIZE: 40, // Tamaño cuadrado para consistencia con UserNavSkeleton y la altura del botón
	HEIGHT: 39,
	BORDER_RADIUS: "6px", // Coincide con var(--border-radius-md)
};

/**
 * Componente que muestra un esqueleto de carga para los botones de navegación de un usuario invitado.
 */
function GuestNavSkeleton(): JSX.Element {
	// Obtiene los colores del esqueleto de forma centralizada a través del hook.
	const { baseColor, highlightColor } = useSkeletonTheme();

	return (
		<SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
			{/* Contenedor Flexbox para alinear los esqueletos horizontalmente */}
			<div
				className="d-flex align-items-center"
				data-testid="guest-nav-skeleton"
			>
				{/* Esqueleto para el botón de texto (visible en md y superior) */}
				<Skeleton
					containerClassName="d-none d-md-block"
					width={GUEST_NAV_SKELETON_SIZES.LOGIN_LINK_WIDTH}
					height={GUEST_NAV_SKELETON_SIZES.HEIGHT}
					aria-hidden="true"
					borderRadius={GUEST_NAV_SKELETON_SIZES.BORDER_RADIUS}
				/>
				{/* Esqueleto para el botón de icono */}
				<Skeleton
					containerClassName="d-block d-md-none"
					width={GUEST_NAV_SKELETON_SIZES.ICON_SIZE}
					height={GUEST_NAV_SKELETON_SIZES.ICON_SIZE}
					aria-hidden="true"
					borderRadius={GUEST_NAV_SKELETON_SIZES.BORDER_RADIUS}
				/>
			</div>
		</SkeletonTheme>
	);
}

export default GuestNavSkeleton;
