import React, { useEffect } from "react";
import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";
import { toggleMode } from "../../slices/themeSlice";
import { MoonIcon, SunIcon } from "../../ui/Icons";
import styles from "./ThemeToggleButton.module.css";
import { RootState, AppDispatch } from "../../store/store"; // Asegúrate de que la ruta sea correcta

/**
 * Props para el componente ThemeToggleButton.
 */
interface ThemeToggleButtonProps {
	readonly className?: string; // Clases CSS adicionales para el botón.
	readonly showText?: boolean; // Si es true, muestra el texto junto al icono.
}

// Asignamos el icono a una constante con el tipo React.ElementType
// para asegurar a TypeScript que es un componente JSX válido.

/**
 * Botón que permite al usuario cambiar entre el tema claro y oscuro.
 */
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Componente ThemeToggleButton.
 */
function ThemeToggleButton({
	className = "",
	showText = false,
}: ThemeToggleButtonProps) {
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

			// Añadimos clase temporal para bloquear transiciones de color
			root.classList.add("theme-toggling");

			// Se asegura de que la etiqueta <html> no tiene las clases 'light' y 'dark' aplicadas antes que el código añada
			// la correcta basada en 'mode'
			root.classList.remove("light", "dark");
			// Añade la clase 'mode' ('light' o 'dark') a <html>
			root.classList.add(mode);
			// Actualiza la variable 'mode' en localStorage
			localStorage.setItem("themeMode", mode);

			/**
			 * Forzamos un reflow para que el cambio de variables CSS se aplique instantáneamente.
			 * Usamos getBoundingClientRect() porque, al ser una llamada a función, satisface las
			 * reglas de linter de "expresiones no usadas" sin necesidad de crear variables.
			 */
			root.getBoundingClientRect();

			// Eliminamos la clase en el siguiente ciclo para restaurar transiciones de hover
			const timer = setTimeout(() => {
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
			<MoonIcon className={styles.themeIcon} />
		) : (
			<SunIcon className={styles.themeIcon} />
		);

	return (
		<button
			type="button"
			className={`${styles.themeToggleBtn} ${className}`}
			onClick={toggleTheme}
			aria-label={
				mode === "light" ? "Activa el modo oscuro" : "Activa el modo claro"
			}
		>
			{icon}
			{showText && (
				<span className="ms-2">
					{mode === "light" ? "Modo oscuro" : "Modo claro"}
				</span>
			)}
		</button>
	);
}

export default ThemeToggleButton;
