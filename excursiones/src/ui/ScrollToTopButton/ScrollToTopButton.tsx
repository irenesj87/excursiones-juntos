import { useState, useEffect } from "react";
import { ArrowUpIcon } from "../Icons";
import styles from "./ScrollToTopButton.module.css";

/**
 * Umbral de scroll en píxeles a partir del cual el botón se hace visible.
 * Se elige un valor bajo (100px) para que sea útil rápidamente.
 */
const SCROLL_THRESHOLD_PX = 100;

/**
 * Botón flotante que permite al usuario volver a la parte superior de la página.
 * Aparece solo cuando el usuario ha hecho scroll hacia abajo.
 *
 * @returns Un elemento de botón con comportamiento de scroll suave.
 */
export function ScrollToTopButton() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		/**
		 * Evalúa la posición actual del scroll para determinar la visibilidad del botón.
		 */
		const toggleVisibility = () => {
			setIsVisible(globalThis.window.scrollY > SCROLL_THRESHOLD_PX);
		};

		globalThis.window.addEventListener("scroll", toggleVisibility, {
			passive: true,
		});
		return () =>
			globalThis.window.removeEventListener("scroll", toggleVisibility);
	}, []);

	/**
	 * Realiza un desplazamiento suave hacia el inicio del documento.
	 */
	const scrollToTop = () => {
		globalThis.window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<button
			type="button"
			className={`${styles.scrollToTopButton} ${isVisible ? styles.visible : ""} btn`}
			onClick={scrollToTop}
			aria-label="Volver arriba"
		>
			<ArrowUpIcon size={24} />
		</button>
	);
}
