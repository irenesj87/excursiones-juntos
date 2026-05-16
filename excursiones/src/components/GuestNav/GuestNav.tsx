import cn from "classnames";
import { Link } from "../../ui/Link";
import { ROUTES } from "../../constants";
import { LoginIcon } from "../../ui/Icons";
import styles from "./GuestNav.module.css";

interface GuestNavProps {
	/**
	 * Clases CSS adicionales para aplicar al contenedor principal de los enlaces.
	 */
	readonly className?: string;
}

/**
 * Muestra los enlaces de navegación para un usuario no logueado.
 */
function GuestNav({ className }: GuestNavProps): JSX.Element {
	return (
		<div className={cn(className, "d-flex align-items-center gap-1")}>
			<Link
				to={ROUTES.LOGIN}
				aria-label="Iniciar sesión"
				className={styles.loginLink}
			>
				{/* Texto visible en breakpoints > 768px */}
				<span className={styles.linkText}>Iniciar sesión</span>

				{/* Icono visible en breakpoints < 768px */}
				<LoginIcon className={styles.linkIcon} aria-hidden="true" />
			</Link>
		</div>
	);
}

export default GuestNav;
