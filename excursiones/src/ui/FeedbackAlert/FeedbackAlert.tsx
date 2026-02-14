import React from "react";
import { Alert } from "react-bootstrap";
import cn from "classnames";
import { CircleAlertIcon, TriangleAlertIcon, CheckCircleIcon } from "../Icons";
import styles from "./FeedbackAlert.module.css";

const VARIANT_CONFIG = {
	danger: {
		Icon: CircleAlertIcon,
		defaultTitle: "Error",
		bootstrapVariant: "danger",
	},
	success: {
		Icon: CheckCircleIcon,
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
 * @component FeedbackAlert
 * @description Muestra un mensaje de feedback (éxito, error, advertencia) al usuario utilizando componentes de Bootstrap.
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
	const { Icon, defaultTitle, bootstrapVariant } = VARIANT_CONFIG[variant];

	return (
		<Alert
			variant={bootstrapVariant}
			onClose={onClose}
			dismissible={!!onClose}
			className={cn(styles.alert, className)}
		>
			<div className={styles.alertContent}>
				<Icon size={24} className={styles.icon} aria-hidden="true" />
				<div>
					<Alert.Heading as="h2" className={styles.title}>
						{title ?? defaultTitle}
					</Alert.Heading>
					<p className={styles.message}>{message}</p>
				</div>
			</div>
		</Alert>
	);
}

