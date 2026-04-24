import { Skeleton } from "../../ui/skeleton";

export const GUEST_NAV_SKELETON_SIZES = {
	LOGIN_LINK_WIDTH: 166,
	ICON_SIZE: 36,
	HEIGHT: 44,
	BORDER_RADIUS: "6px",
};

/**
 * Componente que muestra un esqueleto de carga para los botones de navegación de un usuario invitado.
 */
function GuestNavSkeleton(): JSX.Element {
	return (
		<div className="flex items-center gap-1">
			{/* Esqueleto para el botón de texto (visible en md y superior) */}
			<Skeleton
				className="hidden md:inline-flex md:items-center md:justify-center"
				style={{
					width: GUEST_NAV_SKELETON_SIZES.LOGIN_LINK_WIDTH,
					height: GUEST_NAV_SKELETON_SIZES.HEIGHT,
					borderRadius: GUEST_NAV_SKELETON_SIZES.BORDER_RADIUS,
				}}
				aria-hidden="true"
			/>
			{/* Esqueleto para el botón de icono */}
			<Skeleton
				className="block md:hidden sm:inline-flex sm:items-center sm:justify-center"
				style={{
					width: GUEST_NAV_SKELETON_SIZES.ICON_SIZE,
					height: GUEST_NAV_SKELETON_SIZES.ICON_SIZE,
					borderRadius: GUEST_NAV_SKELETON_SIZES.BORDER_RADIUS,
				}}
				aria-hidden="true"
			/>
		</div>
	);
}

export default GuestNavSkeleton;
