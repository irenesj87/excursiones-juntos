import React, { ErrorInfo, ReactNode } from "react";

/**
 * Props para el componente ErrorBoundary.
 */
interface ErrorBoundaryProps {
	/** Los componentes hijos que el ErrorBoundary protegerá. */
	children: ReactNode;
	/** La UI que se mostrará cuando ocurra un error. */
	fallback: ReactNode;
}

/**
 * Estado para el componente ErrorBoundary.
 */
interface ErrorBoundaryState {
	/** Indica si se ha capturado un error. */
	hasError: boolean;
}

class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
		// Actualiza el estado para que el siguiente renderizado muestre la UI de respaldo.
		return { hasError: true };
	}

	/**
	 * Captura los errores en los componentes hijo y loguea el error.
	 * @param {Error} error - El error que se ha lanzado.
	 * @param {object} errorInfo - Un objeto con una key `componentStack` que contiene la información sobre qué componente
	 * lanzó el error.
	 */
	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// La mejor práctica es ser explícito con el entorno de producción.
		if (process.env.NODE_ENV === "production") {
			// EN PRODUCCIÓN: No exponer detalles en la consola del cliente.
			// Enviar el error a un servicio de logging externo (ej: Sentry, LogRocket, etc.).
			console.error("Se ha producido un error en la aplicación."); // Mensaje genérico
		} else {
			// En cualquier otro entorno (development, test, etc.), es útil ver el error completo.
			// Para evitar la exposición accidental de datos sensibles en el error, solo mostramos
			// información que es segura para la depuración.
			console.error("Error capturado por ErrorBoundary:", {
				stack: error.stack,
				componentStack: errorInfo.componentStack,
			});
		}
	}

	render() {
		return this.state.hasError
			? this.props.fallback // Si hay un error, muestra la UI de respaldo.
			: this.props.children; // Si no, renderiza los componentes hijos.
	}
}

export default ErrorBoundary;
