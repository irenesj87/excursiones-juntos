import styles from "./Hero.module.css";
import heroImage from "../../assets/images/hero-background.jpg";
import heroImageAvif from "../../assets/images/hero-background.avif";
import CustomLink from "../../ui/Link/CustomLink";
import { ROUTES } from "../../constants";

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
				<div className={styles.titleContainer}>
					<h1 className={styles.title}>Descubre tu próxima aventura</h1>
					<p className={styles.subtitle}>
						Conecta con la naturaleza, explora paisajes inolvidables y comparte
						experiencias únicas con tus compañeros de viaje.
					</p>
					<CustomLink to={ROUTES.REGISTER} className={styles.ctaButton}>
						Únete ya
					</CustomLink>
				</div>
			</div>
		</section>
	);
}
