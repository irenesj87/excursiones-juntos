import { useState, useEffect } from "react";
import { ArrowUpIcon } from "../Icons";
import styles from "./ScrollToTop.module.css";

/**
 * Botón flotante que permite al usuario volver a la parte superior de la página.
 * Aparece solo cuando el usuario ha hecho scroll hacia abajo.
 */
export function ScrollToTop() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const toggleVisibility = () => {
			// Umbral reducido a 100px para que el botón sea más persistente y útil
			setIsVisible(globalThis.window.scrollY > 100);
		};

		globalThis.window.addEventListener("scroll", toggleVisibility, {
			passive: true,
		});
		return () =>
			globalThis.window.removeEventListener("scroll", toggleVisibility);
	}, []);

	const scrollToTop = () => {
		globalThis.window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<button
			type="button"
			/* Eliminamos btn-primary para usar nuestros propios estilos neutros y evitar distracciones */
			className={`${styles.scrollToTop} ${isVisible ? styles.visible : ""} btn`}
			onClick={scrollToTop}
			aria-label="Volver arriba"
		>
			<ArrowUpIcon size={24} />
		</button>
	);
}
