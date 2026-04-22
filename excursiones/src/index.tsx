import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "./css/Global.css";
import "./css/Themes.css";
/* index.css (Tailwind) debe ser el último para asegurar que sus 
   utilidades tengan prioridad sobre Bootstrap y estilos globales */
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import Store from "./store/store";
import { Provider } from "react-redux";

// Buscamos el elemento raíz en el DOM.
const rootElement = document.getElementById("root");

// Nos aseguramos de que el elemento raíz exista antes de intentar renderizar la aplicación.
// Esto previene errores en tiempo de ejecución si el div#root no se encuentra en el HTML.
if (!rootElement) {
	throw new Error(
		"No se pudo encontrar el elemento raíz para montar la aplicación.",
	);
}

const root = ReactDOM.createRoot(rootElement);
root.render(
	<React.StrictMode>
		<Provider store={Store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>
	</React.StrictMode>,
);
