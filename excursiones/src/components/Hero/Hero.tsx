import styles from "./Hero.module.css";
import heroImage from "../../assets/images/hero-background.jpg";
import heroImageAvif from "../../assets/images/hero-background.avif";

/**
 * Representa la sección principal de la cabecera (Hero) de la página.
 * Muestra una imagen de fondo inspiradora y el título principal.
 */
export function Hero() {
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
				<div className="text-center text-white px-3">
					<h1 className="display-4 fw-bold mb-2">
						Descubre tu próxima aventura
					</h1>
					<p className="lead fw-normal mb-0">
						Explora las mejores rutas de senderismo
					</p>
				</div>
			</div>
		</section>
	);
}
