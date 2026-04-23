import { Alert, AlertTitle, AlertDescription } from "../alert";
import { cn } from "../../lib/utils";
import { CircleAlertIcon, TriangleAlertIcon, CheckIcon, XIcon } from "../Icons";

type AlertVariant = "destructive" | "success" | "warning" | "default";

const VARIANT_CONFIG = {
	danger: {
		Icon: CircleAlertIcon,
		defaultTitle: "Error",
		uiVariant: "destructive" as const,
	},
	success: {
		Icon: CheckIcon,
		defaultTitle: "Éxito",
		uiVariant: "success" as const,
	},
	warning: {
		Icon: TriangleAlertIcon,
		defaultTitle: "Atención",
		uiVariant: "warning" as const,
	},
} as const;

type Variant = keyof typeof VARIANT_CONFIG;

/**
 * @component FeedbackAlert
 * @description Muestra un mensaje de feedback (éxito, error, advertencia) al usuario utilizando componentes de shadcn/ui y Tailwind CSS.
 */
interface FeedbackAlertProps {
	/** El tipo de alerta a mostrar. */
	readonly variant: Variant;
	/** El mensaje principal a mostrar. */
	readonly message: string;
	/** Función opcional que se ejecuta cuando se cierra la alerta. Si se provee, se mostrará un botón para cerrar. */
	readonly onClose?: () => void;
	/** Título opcional de la alerta. Si no se provee, se usa uno por defecto según la variante. */
	readonly title?: string;
	/** Clases CSS adicionales para el contenedor de la alerta. */
	readonly className?: string;
}

/**
 * Componente que muestra una alerta de feedback personalizable.
 */
export function FeedbackAlert({
	variant,
	message,
	onClose,
	title,
	className,
}: FeedbackAlertProps) {
	const { Icon, defaultTitle, uiVariant } = VARIANT_CONFIG[variant] as {
		Icon: typeof CircleAlertIcon;
		defaultTitle: string;
		uiVariant: AlertVariant;
	};

	return (
		<Alert
			variant={uiVariant}
			className={cn(
				"relative flex items-start justify-between pr-12 shadow-sm transition-transform duration-200 ease-out",
				className,
			)}
		>
			<div className="flex items-start gap-3">
				<Icon size={20} className="mt-1 shrink-0" aria-hidden="true" />
				<div>
					<AlertTitle className="text-base font-semibold leading-none tracking-tight">
						{title ?? defaultTitle}
					</AlertTitle>
					<AlertDescription className="mt-2 text-sm opacity-90">
						{message}
					</AlertDescription>
				</div>
			</div>
			{onClose && (
				<button
					onClick={onClose}
					className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-sm bg-transparent p-0 text-current opacity-60 transition-all duration-200 hover:bg-foreground/10 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					aria-label="Cerrar alerta"
				>
					<XIcon size={16} />
				</button>
			)}
		</Alert>
	);
}
