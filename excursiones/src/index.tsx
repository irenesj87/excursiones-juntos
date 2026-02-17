import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import "@fontsource-variable/dm-sans";
import "./css/Global.css";
import "./css/Themes.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import Store from "./store/store";
import { Provider } from "react-redux";
import reportWebVitals from "./reportWebVitals";

// Buscamos el elemento raíz en el DOM.
const rootElement = document.getElementById("root");

// Nos aseguramos de que el elemento raíz exista antes de intentar renderizar la aplicación.
// Esto previene errores en tiempo de ejecución si el div#root no se encuentra en el HTML.
if (!rootElement) {
	throw new Error(
		"No se pudo encontrar el elemento raíz para montar la aplicación."
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
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
