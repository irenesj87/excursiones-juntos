import { createContext, useContext } from "react";

/**
 * Define la forma del contexto de autenticación.
 */
interface AuthContextType {
	/** Indica si la comprobación de autenticación inicial ha finalizado. */
	isAuthCheckComplete: boolean;
}

/**
 * Contexto para proporcionar el estado de la comprobación de autenticación a los componentes anidados.
 */
export const AuthContext = createContext<AuthContextType | undefined>(
	// El valor inicial es `undefined` para permitir la comprobación en `useAuthContext`
	// y asegurar que el hook se use dentro de un `AuthProvider`.
	undefined
);

/**
 * Hook personalizado para acceder fácilmente al AuthContext.
 */
export const useAuthContext = (): AuthContextType => {
	const context = useContext(AuthContext);

	// Esta comprobación asegura que el hook solo se use dentro de un AuthProvider.
	// Si 'context' es 'undefined', significa que falta el Provider en el árbol de componentes.
	if (context === undefined) {
		throw new Error(
			"useAuthContext debe ser usado dentro de un AuthContext.Provider"
		);
	}

	return context;
};
