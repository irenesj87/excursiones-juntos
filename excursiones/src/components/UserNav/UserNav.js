import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import StyledNavLink from "../StyledNavLink";
import StyledButton from "../StyledButton";
import { logoutUser } from "../../services/authService";
import { logout } from "../../slices/loginSlice";
import { ROUTES } from "../../constants";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./UserNav.module.css";
import { FiUser } from "react-icons/fi";

/**
 * @typedef {object} UserNavProps
 * @property {() => void} [onCloseMenu] - Función para cerrar el menú contenedor en breakpoints pequeños.
 */

/**
 * Componente que muestra los enlaces de navegación para un usuario logueado, incluyendo un enlace al perfil y un botón para cerrar
 * sesión.
 * Permite cerrar un menú contenedor (como un Offcanvas o un Dropdown) si se proporciona la función `onCloseMenu`.
 * @param {UserNavProps} props - Las propiedades del componente.
 * @returns {React.ReactElement} - El componente de navegación para usuarios logueados.
 */
function UserNav(props) {
	// Aseguramos que onCloseMenu siempre sea una función, incluso si las props no se pasan.
	const { onCloseMenu = () => {} } = props;
	const dispatch = useDispatch();
	const navigate = useNavigate();

	/**
	 * Maneja el proceso de cierre de sesión del usuario.
	 */
	const handleLogout = useCallback(() => {
		onCloseMenu?.();
		logoutUser();
		dispatch(logout());
		navigate(ROUTES.HOME);
	}, [dispatch, navigate, onCloseMenu]);

	return (
		<>
			<StyledNavLink
				to={ROUTES.USER}
				onClick={onCloseMenu}
				className="me-lg-3"
				aria-label="Tu perfil"
			>
				<FiUser aria-hidden="true" />
				<span className="ms-2">Tu perfil</span>
			</StyledNavLink>
			<StyledButton onClick={handleLogout} className={styles.logoutLink}>
				Cierra sesión
			</StyledButton>
		</>
	);
}

export default UserNav;
