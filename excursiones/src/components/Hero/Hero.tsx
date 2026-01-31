import { ReactNode } from "react";
import styles from "./Hero.module.css";
import heroImage from "../../assets/images/hero-background.jpg";
import heroImageAvif from "../../assets/images/hero-background.avif";

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
			aria-label="Cabecera principal con imagen de musgo"
		>
			<picture>
				{/* Formato AVIF: Prioridad alta por ser más ligero */}
				<source
					srcSet={`${heroImageAvif} 1920w`}
					sizes="100vw"
					type="image/avif"
				/>
				{/* Fallback: JPG original para navegadores que no soporten AVIF */}
				<img
					className={styles.heroBackground}
					src={heroImage}
					alt=""
					loading="eager" // Prioridad alta para LCP
					fetchPriority="high" // Refuerza la prioridad de carga
					width={1920}
					height={1080}
				/>
			</picture>
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
