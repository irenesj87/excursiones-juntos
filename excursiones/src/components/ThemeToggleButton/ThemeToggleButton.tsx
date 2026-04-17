import { useEffect } from "react";
import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";
import { toggleMode } from "../../slices/themeSlice";
import { MoonIcon, SunIcon } from "../../ui/Icons";
import styles from "./ThemeToggleButton.module.css";
import { RootState, AppDispatch } from "../../store/store"; // Asegúrate de que la ruta sea correcta

/**
 * Prop del componente.
 */
interface ThemeToggleButtonProps {
	readonly className?: string; // Clases CSS adicionales para el botón.
}

/**
 * Custom hooks locales para mantener la consistencia con el Store de Redux.
 */
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Componente ThemeToggleButton.
 *
 * Permite al usuario alternar entre modos de color (claro/oscuro).
 * Implementa una técnica de bloqueo de transiciones para un cambio de tema instantáneo y fluido.
 */
export function ThemeToggleButton({ className = "" }: ThemeToggleButtonProps) {
	const mode = useAppSelector((state: RootState) => state.themeReducer.mode);
	const dispatch = useAppDispatch();

	/**
	 * Efecto que se ejecuta cuando el `mode` (tema) cambia.
	 * Aplica la clase CSS correspondiente al elemento `<html>` y guarda la preferencia en `localStorage`.
	 */
	useEffect(() => {
		if (mode === "light" || mode === "dark") {
			// Se selecciona la etiqueta <html>
			const root = document.documentElement;

			/**
			 * Aplicamos la clase 'theme-toggling' para suspender las transiciones de color en el DOM.
			 * Esto evita que el usuario vea un degradado extraño mientras las variables CSS se actualizan.
			 */
			root.classList.add("theme-toggling");

			// Limpieza y aplicación del nuevo modo
			root.classList.remove("light", "dark");
			// Añade la clase 'mode' ('light' o 'dark') a <html>
			root.classList.add(mode);
			// Actualiza la variable 'mode' en localStorage
			localStorage.setItem("themeMode", mode);

			/**
			 * Forzamos un reflow para que el cambio de variables CSS se aplique instantáneamente.
			 */
			root.getBoundingClientRect();

			// Eliminamos la clase en el siguiente ciclo para restaurar transiciones de hover
			const timer = globalThis.setTimeout(() => {
				root.classList.remove("theme-toggling");
			}, 50);

			return () => clearTimeout(timer);
		}
	}, [mode]);

	/**
	 * Alterna el modo de tema (claro/oscuro) despachando la acción de Redux.
	 */
	const toggleTheme = () => {
		dispatch(toggleMode());
	};

	const icon =
		mode === "light" ? (
			<MoonIcon size={20} className={styles.themeIcon} />
		) : (
			<SunIcon size={20} className={styles.themeIcon} />
		);

	return (
		<button
			type="button"
			className={`${styles.themeToggleBtn} ${className}`.trim()}
			onClick={toggleTheme}
			aria-pressed={mode === "dark"}
			aria-label={
				mode === "light" ? "Activa el modo oscuro" : "Activa el modo claro"
			}
		>
			{icon}
		</button>
	);
}
