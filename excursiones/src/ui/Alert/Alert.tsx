import { Alert as BootstrapAlert } from "react-bootstrap";
import cn from "classnames";
import { CircleAlertIcon, TriangleAlertIcon, CheckIcon } from "../Icons";
import styles from "./Alert.module.css";

/**
 * Configuración visual y semántica por cada variante de alerta.
 */
const VARIANT_CONFIG = {
	danger: {
		Icon: CircleAlertIcon,
		defaultTitle: "Error",
		bootstrapVariant: "danger",
	},
	success: {
		Icon: CheckIcon,
		defaultTitle: "Éxito",
		bootstrapVariant: "success",
	},
	warning: {
		Icon: TriangleAlertIcon,
		defaultTitle: "Atención",
		bootstrapVariant: "warning",
	},
} as const;

type Variant = keyof typeof VARIANT_CONFIG;

/**
 * Propiedades para el componente Alert.
 * @interface AlertProps
 */
interface AlertProps {
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
 *
 * @param {AlertProps} props - Propiedades del componente.
 * @returns {JSX.Element} Un componente de alerta estilizado.
 */
export function Alert({
	variant,
	message,
	onClose,
	title,
	className,
}: AlertProps) {
	const { Icon, defaultTitle, bootstrapVariant } = VARIANT_CONFIG[variant];

	return (
		<BootstrapAlert
			variant={bootstrapVariant}
			onClose={onClose}
			dismissible={!!onClose}
			className={cn(styles.alert, className)}
		>
			<div className={styles.alertContent}>
				<Icon size={24} className={styles.icon} aria-hidden="true" />
				<div>
					<BootstrapAlert.Heading as="h3" className={styles.title}>
						{title ?? defaultTitle}
					</BootstrapAlert.Heading>
					<p className={styles.message}>{message}</p>
				</div>
			</div>
		</BootstrapAlert>
	);
}
