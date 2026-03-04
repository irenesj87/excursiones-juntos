import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSkeletonTheme } from "../../hooks/useSkeletonTheme";

// Define placeholder dimensions as constants to avoid magic numbers and improve maintainability.
const USER_NAV_SKELETON_SIZES = {
	PROFILE_LINK_WIDTH: 127, // +28px por el icono
	LOGOUT_BUTTON_WIDTH: 150, // +28px por el icono
	ICON_SIZE: 40, // Tamaño cuadrado para el modo icono
	HEIGHT: 40,
	BORDER_RADIUS: "6px", // Coincide con var(--border-radius-md)
};

/**
 * Componente que muestra un esqueleto de carga para los botones de navegación de un usuario logueado.
 */
function UserNavSkeleton() {
	// Obtiene los colores del esqueleto de forma centralizada a través del hook.
	const { baseColor, highlightColor } = useSkeletonTheme();

	return (
		<SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
			<div className="d-flex align-items-center gap-1" aria-hidden="true">
				{/* --- PERFIL --- */}
				{/* Desktop: Texto */}
				<Skeleton
					containerClassName="d-none d-md-block"
					width={USER_NAV_SKELETON_SIZES.PROFILE_LINK_WIDTH}
					height={USER_NAV_SKELETON_SIZES.HEIGHT}
					borderRadius={USER_NAV_SKELETON_SIZES.BORDER_RADIUS}
				/>
				{/* Móvil: Icono */}
				<Skeleton
					containerClassName="d-block d-md-none"
					width={USER_NAV_SKELETON_SIZES.ICON_SIZE}
					height={USER_NAV_SKELETON_SIZES.ICON_SIZE}
					borderRadius={USER_NAV_SKELETON_SIZES.BORDER_RADIUS}
				/>

				{/* --- LOGOUT --- */}
				{/* Desktop: Texto */}
				<Skeleton
					containerClassName="d-none d-md-block"
					width={USER_NAV_SKELETON_SIZES.LOGOUT_BUTTON_WIDTH}
					height={USER_NAV_SKELETON_SIZES.HEIGHT}
					borderRadius={USER_NAV_SKELETON_SIZES.BORDER_RADIUS}
				/>
				{/* Móvil: Icono */}
				<Skeleton
					containerClassName="d-block d-md-none"
					width={USER_NAV_SKELETON_SIZES.ICON_SIZE}
					height={USER_NAV_SKELETON_SIZES.ICON_SIZE}
					borderRadius={USER_NAV_SKELETON_SIZES.BORDER_RADIUS}
				/>
			</div>
		</SkeletonTheme>
	);
}

export default UserNavSkeleton;
