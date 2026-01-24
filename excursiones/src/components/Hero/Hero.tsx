import { ReactNode } from "react";
import styles from "./Hero.module.css";
import heroImage from "../../assets/images/hero-background.jpg";

interface HeroProps {
	/**
	 * Elemento principal que se renderizará dentro del Hero,
	 * idealmente el componente de búsqueda.
	 */
	readonly children?: ReactNode;
}

/**
 * Representa la sección principal de la cabecera (Hero) de la página.
 * Muestra una imagen de fondo inspiradora, un título y permite inyectar contenido.
 *
 * @param children - El componente a renderizar dentro del área de contenido.
 * @returns El componente Hero renderizado.
 */
export function Hero({ children }: HeroProps) {
	return (
		<section
			className={styles.hero}
			aria-label="Cabecera principal con imagen de un paisaje montañoso"
		>
			<img
				className={styles.heroBackground}
				src={heroImage}
				alt=""
				loading="eager" // Prioridad alta para LCP (Largest Contentful Paint)
				width={1920}
				height={1080}
			/>
			<div className={styles.heroOverlay} aria-hidden="true" />
			<div className={styles.heroContent}>
				<div className={styles.titleContainer}>
					<h1 className={styles.title}>Tu próxima aventura te espera</h1>
					<p className={styles.subtitle}>
						Descubre y únete a excursiones con personas como tú.
					</p>
				</div>
				{children}
			</div>
		</section>
	);
}
