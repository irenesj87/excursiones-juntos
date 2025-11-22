import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import App from "./App";
import loginSliceReducer from "./slices/loginSlice";
import filterSliceReducer from "./slices/filterSlice";
import themeSliceReducer from "./slices/themeSlice";
import { searchExcursions } from "./services/excursionService";

// Mock de ResizeObserver para el entorno de JSDOM.
// JSDOM no incluye esta API del navegador, por lo que la simulamos con una clase vacía.
globalThis.ResizeObserver = class ResizeObserver {
	observe() {
		// noop
	}
	unobserve() {
		// noop
	}
	disconnect() {
		// noop
	}
};

// Mock del servicio de búsqueda para evitar llamadas de red reales.
jest.mock("./services/excursionService");

// Definimos el tipo del estado raíz de Redux para usarlo en el preloadedState.
const rootReducer = combineReducers({
	loginReducer: loginSliceReducer,
	filterReducer: filterSliceReducer,
	themeReducer: themeSliceReducer,
});

type RootState = ReturnType<typeof rootReducer>;

/**
 * Función de ayuda para renderizar componentes que dependen de Redux y React Router.
 * Crea un store de Redux de prueba y envuelve el componente en Provider y MemoryRouter.
 */
const renderWithProviders = (
	ui: React.ReactElement,
	{
		preloadedState = {},
		route = "/",
		...renderOptions
	}: { preloadedState?: Partial<RootState>; route?: string } = {}
) => {
	const store = configureStore({
		reducer: rootReducer,
		preloadedState,
	});
	return render(ui, {
		wrapper: ({ children }: { children: React.ReactNode }) => (
			<Provider store={store}>
				<MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
			</Provider>
		),
		...renderOptions,
	});
};

beforeEach(() => {
	// Limpiamos los mocks antes de cada test.
	(searchExcursions as jest.Mock).mockClear();
});

test("renders main title", async () => {
	renderWithProviders(<App />);
	const titleElement = await screen.findByText(/Próximas excursiones/i);
	expect(titleElement).toBeInTheDocument();
});
