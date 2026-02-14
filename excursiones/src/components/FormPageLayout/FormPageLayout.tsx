import { useId } from "react";
import { Container, Row, Col, Card, ColProps } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "./FormPageLayout.module.css";

interface FormPageLayoutProps {
	/** El título principal que se mostrará en la tarjeta. */
	readonly title: string;
	/** Un subtítulo opcional para dar más contexto. */
	readonly subtitle?: string;
	/** El contenido del formulario a renderizar. */
	readonly children: React.ReactNode;
	/** Ancho de la columna para el formulario en pantallas XL. Por defecto "5". */
	readonly colWidth?: ColProps["xl"];
	/** Clase CSS opcional para el contenedor principal. */
	readonly containerClassName?: string;
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
	children,
	colWidth = "5",
	containerClassName,
	switcher,
}: FormPageLayoutProps) {
	const titleId = useId();

	return (
		<Container
			fluid
			className={`${styles.container} d-flex flex-column flex-grow-1 ${containerClassName ?? ""}`}
		>
			<Row className="justify-content-center align-items-center flex-grow-1">
				<Col xs={12} md={9} lg={8} xl={colWidth}>
					<Card
						as="section"
						className={styles.contentPane}
						aria-labelledby={titleId}
					>
						<Card.Body className="p-4">
							<Card.Title as="h2" id={titleId} className={styles.cardTitle}>
								{title}
							</Card.Title>
							{subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
							{children}
						</Card.Body>
						{switcher && (
							<Card.Footer className={`${styles.switcher} d-lg-none p-3`}>
								{switcher.prompt}{" "}
								<Link to={switcher.linkTo} className={styles.switcherLink}>
									{switcher.linkText}
								</Link>
							</Card.Footer>
						)}
					</Card>
				</Col>
			</Row>
		</Container>
	);
}
