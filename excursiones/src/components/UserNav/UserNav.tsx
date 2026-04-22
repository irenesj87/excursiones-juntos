import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import StyledNavLink from "../../ui/Link";
import { Button } from "../../ui/button";
import { logoutUser } from "../../services/authService";
import { logout } from "../../slices/loginSlice";
import { ROUTES } from "../../constants";
import { ProfileIcon, LogoutIcon } from "../../ui/Icons";
import styles from "./UserNav.module.css";

/**
 * Componente que muestra los enlaces de navegación para un usuario logueado, incluyendo un enlace al perfil y un botón para cerrar
 * sesión.
 * Muestra iconos en dispositivos móviles y texto en pantallas más grandes.
 */
function UserNav() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	/**
	 * Maneja el proceso de cierre de sesión del usuario.
	 */
	const handleLogout = () => {
		logoutUser();
		dispatch(logout());
		navigate(ROUTES.HOME);
	};

	return (
		<div className="d-flex align-items-center gap-1">
			<StyledNavLink
				to={ROUTES.USER}
				className={styles.profileLink}
				aria-label="Mi perfil"
			>
				<span className={styles.linkText}>Mi perfil</span>
				<ProfileIcon className={styles.linkIcon} aria-hidden="true" />
			</StyledNavLink>

			<Button
				onClick={handleLogout}
				className={styles.logoutLink}
				aria-label="Cerrar sesión"
			>
				<span className={styles.linkText}>Cerrar sesión</span>
				<LogoutIcon className={styles.linkIcon} aria-hidden="true" />
			</Button>
		</div>
	);
}

export default UserNav;
