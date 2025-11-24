import React, { ErrorInfo, ReactNode } from "react";

/**
 * @component ErrorBoundary
 * @description Es un componente de React que captura errores de JavaScript en cualquier parte de su árbol de componentes
 * hijo, los registra y muestra una UI de respaldo en lugar del árbol de componentes que falló.
 * Esto previene que toda la aplicación se rompa y mejora la experiencia del usuario.
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

/**
 * Componente de clase que implementa el patrón de Error Boundary en React.
 */
class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	/**
	 * Actualiza el estado cuando se captura un error, para mostrar la UI de respaldo.
	 */
	static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
		return { hasError: true };
	}

	/**
	 * Captura los errores en los componentes hijo y loguea el error.
	 */
	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		/**
		 * En producción no se exponen detalles en la consola del cliente.
		 * Enviar el error a un servicio de logging externo (ej: Sentry, LogRocket, etc.).
		 */
		if (process.env.NODE_ENV === "production") {
			console.error("Se ha producido un error en la aplicación."); // Mensaje genérico
		} else {
			/**
			 * En cualquier otro entorno (development, test, etc.), es útil ver el error completo.
			 * Para evitar la exposición accidental de datos sensibles en el error, solo se muestra la
			 * información que es segura para la depuración.
			 * NO se registra `error.stack`, ya que puede contener datos sensibles
			 * que causaron el error. En su lugar, se registra el mensaje y el `componentStack`.
			 */
			console.error("ErrorBoundary capturó un error:", {
				message: error.message,
				componentStack: errorInfo.componentStack,
			});
		}
	}

	/**
	 * Detecta cambios en las props para resetear el estado de error si es necesario.
	 */
	componentDidUpdate(prevProps: ErrorBoundaryProps) {
		/**
		 * Si la clave de reseteo ha cambiado y el componente tiene un error,
		 * se resetea el estado para que intente renderizar los hijos de nuevo.
		 * Esto es útil al cambiar de ruta en la aplicación.
		 */
		if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
			this.setState({ hasError: false });
		}
	}

	render() {
		return this.state.hasError
			/**
			 * Si se ha capturado un error, renderiza la UI de respaldo proporcionada.
			 */
			? this.props.fallback
			/**
			 * Si no hay error, renderiza los componentes hijos normalmente.
			 */
			: this.props.children;
	}
}

export default ErrorBoundary;
