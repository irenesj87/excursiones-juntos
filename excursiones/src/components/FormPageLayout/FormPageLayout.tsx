import { useId } from "react";
import { Container, Row, Col, Card, ColProps } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "./FormPageLayout.module.css";

// Definición de las props que acepta el componente FormPageLayout.
interface FormPageLayoutProps {
	readonly title: string; // El título principal que se mostrará en la tarjeta.
	readonly subtitle?: string; // Un subtítulo opcional para dar más contexto.
	readonly children: React.ReactNode; // El contenido del formulario a renderizar.
	readonly colWidth?: ColProps["xl"]; // Ancho de la columna para el formulario.
	readonly containerClassName?: string; // Clase CSS opcional para el contenedor principal.
	readonly switcher?: {
		readonly prompt: string; // Texto que precede al enlace (ej. "¿No tienes cuenta?").
		readonly linkText: string; // Texto del enlace (ej. "Regístrate").
		readonly linkTo: string; // La ruta a la que debe navegar el enlace (ej. "/register").
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
	// Genera un ID único y estable para el título, garantizando la accesibilidad.
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
