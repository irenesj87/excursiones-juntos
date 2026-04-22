import { useId } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from "../../ui/card";

interface FormPageLayoutProps {
	/** El título principal que se mostrará en la tarjeta. */
	readonly title: string;
	/** Un subtítulo opcional para dar más contexto. */
	readonly subtitle?: string;
	/** ID opcional para el subtítulo para vinculación con aria-describedby. */
	readonly subtitleId?: string;
	/** El contenido del formulario a renderizar. */
	readonly children: React.ReactNode;
	/** Clase CSS opcional para el contenedor principal. */
	readonly containerClassName?: string;
	/** Configuración opcional para mostrar un enlace de cambio de página (ej. "¿No tienes cuenta? Regístrate"). */
	readonly switcher?: {
		/** Texto que precede al enlace (ej. "¿No tienes cuenta?"). */
		readonly prompt: string;
		/** Texto del enlace (ej. "Regístrate"). */
		readonly linkText: string;
		/** La ruta a la que debe navegar el enlace. */
		readonly linkTo: string;
	};
}

/**
 * Componente que proporciona un diseño de página reutilizable para formularios.
 * Centra el contenido del formulario en una tarjeta, adaptándose a diferentes breakpoints.
 */
export function FormPageLayout({
	title,
	subtitle,
	subtitleId,
	children,
	containerClassName,
	switcher,
}: FormPageLayoutProps) {
	const titleId = useId();

	return (
		<main
			className={cn(
				"min-h-[calc(100vh-var(--navbar-height))] w-full grid place-items-center p-md bg-background",
				containerClassName,
			)}
		>
			<div className="w-full max-w-lg">
				<Card
					className="border-none shadow-premium bg-surface/50 backdrop-blur-sm"
					aria-labelledby={titleId}
				>
					<CardHeader className="space-y-sm text-center">
						<CardTitle
							id={titleId}
							className="text-2xl font-semibold tracking-tight"
						>
							{title}
						</CardTitle>
						{subtitle && (
							<p id={subtitleId} className="text-muted-foreground text-sm">
								{subtitle}
							</p>
						)}
					</CardHeader>
					<CardContent>{children}</CardContent>
					{switcher && (
						<CardFooter className="justify-center text-sm text-muted-foreground border-t bg-muted/30 py-md">
							{switcher.prompt}{" "}
							<Link
								to={switcher.linkTo}
								className="ml-xs text-primary font-medium hover:underline"
							>
								{switcher.linkText}
							</Link>
						</CardFooter>
					)}
				</Card>
			</div>
		</main>
	);
}
