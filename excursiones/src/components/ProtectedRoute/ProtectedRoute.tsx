import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "../../types";

/** Define las propiedades esperadas por el componente ProtectedRoute. */
interface ProtectedRouteProps {
	/** El componente a renderizar si el usuario está autenticado. */
	children: React.ReactNode;
	/** Indica si la comprobación de autenticación inicial ha finalizado. */
	isAuthCheckComplete: boolean;
}

/**
 * Componente que protege rutas, redirigiendo a la página de login si el usuario no está autenticado.
 */
const ProtectedRoute = ({
	children,
	isAuthCheckComplete,
}: ProtectedRouteProps): React.ReactElement | null => {
	const { login: isLoggedIn } = useSelector(
		(state: RootState) => state.loginReducer
	);
	// Se obtiene la ubicación actual para redirigir al usuario después de iniciar sesión.
	const location = useLocation();

	// Si la comprobación de autenticación ha finalizado y el usuario no está logueado, se le redirige a la página de login.
	// Se guarda la ubicación actual (`from: location`) para que, después de iniciar sesión, se pueda redirigir al usuario de vuelta
	// a la página que intentaba visitar.
	if (isAuthCheckComplete && !isLoggedIn) {
		return <Navigate to="/loginPage" state={{ from: location }} replace />;
	}

	// Si la comprobación de autenticación aún no ha finalizado, o si ha finalizado y el usuario está autenticado, se renderiza el
	// contenido hijo.
	// Mientras la comprobación está en curso, el componente hijo (`LazyRouteWrapper`) mostrará un esqueleto de carga, evitando una
	// pantalla en blanco.
	return <>{children}</>;
};

export default ProtectedRoute;
