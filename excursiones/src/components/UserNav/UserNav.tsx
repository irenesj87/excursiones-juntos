import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import StyledNavLink from "../../ui/Link";
import Button from "../../ui/CustomButton/CustomButton";
import { logoutUser } from "../../services/authService";
import { logout } from "../../slices/loginSlice";
import { ROUTES } from "../../constants";
import styles from "./UserNav.module.css";

/**
 * Define las propiedades que recibe el componente UserNav.
 */
interface UserNavProps {
	readonly onCloseMenu?: () => void; // Función opcional para cerrar un menú (ej: en responsive).
}

const NO_OP = () => {
	/* no-op */
};

/**
 * Componente que muestra los enlaces de navegación para un usuario logueado, incluyendo un enlace al perfil y un botón para cerrar
 * sesión.
 * Permite cerrar un menú contenedor (como un Offcanvas o un Dropdown) si se proporciona la función `onCloseMenu`.
 */
function UserNav({ onCloseMenu = NO_OP }: UserNavProps) {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	/**
	 * Maneja el proceso de cierre de sesión del usuario.
	 */
	const handleLogout = () => {
		onCloseMenu();
		logoutUser();
		dispatch(logout());
		navigate(ROUTES.HOME);
	};

	return (
		<>
			<StyledNavLink
				to={ROUTES.USER}
				onClick={onCloseMenu}
				className={`${styles.profileLink} me-lg-3`}
				aria-label="Mi perfil"
			>
				Mi perfil
			</StyledNavLink>
			<Button onClick={handleLogout} className={styles.logoutLink}>
				Cerrar sesión
			</Button>
		</>
	);
}

export default UserNav;
