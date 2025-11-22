import React from "react";
import "./App.css";
import Layout from "./components/Layout/Layout";
import { useAuth } from "./hooks/useAuth";
import { AuthContext } from "./context/AuthContext";

/**
 * Componente raíz de la aplicación.
 * Se encarga de inicializar la lógica de autenticación y de proveer el
 * contexto de autenticación al resto de la aplicación antes de renderizar el
 * layout principal.
 */
function App(): JSX.Element {
	// Se llama al hook de autenticación en el componente de más alto nivel de la aplicación.
	// Esto asegura que la verificación del token se ejecute una sola vez.
	const { isAuthCheckComplete } = useAuth();
	const contextValue = { isAuthCheckComplete };

	// Se provee el estado `isAuthCheckComplete` al resto de la aplicación a través de un contexto.
	// Cualquier componente hijo podrá saber si la comprobación inicial ha terminado.
	return (
		<AuthContext.Provider value={contextValue}>
			<Layout />
		</AuthContext.Provider>
	);
}

export default App;
