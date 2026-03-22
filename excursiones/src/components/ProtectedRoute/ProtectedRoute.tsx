import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "../../store/store";
import { ROUTES } from "../../constants";

/** Define las propiedades esperadas por el componente ProtectedRoute. */
interface ProtectedRouteProps {
	/** El componente a renderizar si el usuario está autenticado. */
	readonly children: React.ReactNode;
	/** Indica si la comprobación de autenticación inicial ha finalizado. */
	readonly isAuthCheckComplete: boolean;
}

/**
 * Componente que protege rutas, redirigiendo a la página de login si el usuario no está autenticado.
 */
export function ProtectedRoute({
	children,
	isAuthCheckComplete,
}: ProtectedRouteProps): React.ReactElement {
	// Optimizamos el selector para suscribirnos solo al booleano 'login', evitando re-renderizados innecesarios.
	const isLoggedIn = useSelector(
		(state: RootState) => state.loginReducer.login,
	);
	// Se obtiene la ubicación actual para redirigir al usuario después de iniciar sesión.
	const location = useLocation();

	// Si la comprobación de autenticación ha finalizado y el usuario no está logueado, se le redirige a la página
	// de login.
	if (isAuthCheckComplete && !isLoggedIn) {
		return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
	}

	// Si la comprobación de autenticación aún no ha finalizado, o si ha finalizado y el usuario está autenticado,
	// se renderiza el contenido hijo.
	// Mientras la comprobación está en curso, el componente hijo (`LazyRouteWrapper`) mostrará un esqueleto de
	// carga, evitando una pantalla en blanco.
	return <>{children}</>;
}
