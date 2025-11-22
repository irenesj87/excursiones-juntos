// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock de globalThis.matchMedia para los tests de Jest.
// https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(globalThis, "matchMedia", {
	writable: true, // Permite que la propiedad sea modificada por otras pruebas si es necesario.
	// Se reemplaza jest.fn().mockImplementation por una función simple para asegurar que siempre
	// retorne un objeto y evitar el error "Cannot set properties of undefined".
	value: (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(), // Deprecated
		removeListener: jest.fn(), // Deprecated
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	}),
});
