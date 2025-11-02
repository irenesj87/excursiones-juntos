import React, { ErrorInfo, ReactNode } from "react";

/**
 * `ErrorBoundary` es un componente de React que captura errores de JavaScript en cualquier parte de su árbol de componentes
 * hijo, los registra y muestra una UI de respaldo en lugar del árbol de componentes que falló.
 * Esto previene que toda la aplicación se rompa y mejora la experiencia del usuario.
 * También permite resetear el estado de error mediante una clave (`resetKey`), útil para la navegación.
 */
interface ErrorBoundaryProps {
	/** Los componentes hijos que el ErrorBoundary protegerá. */
	children: ReactNode;
	/** Una clave que, al cambiar, reseteará el estado del ErrorBoundary. Útil para navegación. */
	resetKey?: string | number;
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
			// NO registramos `error.stack` directamente, ya que puede contener datos sensibles
			// que causaron el error. En su lugar, registramos el mensaje y el `componentStack`.
			console.error("ErrorBoundary capturó un error:", {
				message: error.message,
				componentStack: errorInfo.componentStack,
			});
		}
	}

	componentDidUpdate(prevProps: ErrorBoundaryProps) {
		// Si la clave de reseteo ha cambiado y el componente tiene un error,
		// reseteamos el estado para que intente renderizar los hijos de nuevo.
		// Esto es útil, por ejemplo, al cambiar de ruta en la aplicación.
		if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
			this.setState({ hasError: false });
		}
	}

	render() {
		return this.state.hasError
			? this.props.fallback // Si hay un error, muestra la UI de respaldo.
			: this.props.children; // Si no, renderiza los componentes hijos.
	}
}

export default ErrorBoundary;
