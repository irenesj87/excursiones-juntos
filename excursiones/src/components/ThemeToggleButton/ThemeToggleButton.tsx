import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";
import { toggleMode } from "../../slices/themeSlice";
import styles from "./ThemeToggleButton.module.css";
import { RootState, AppDispatch } from "../../store/store"; // Asegúrate de que la ruta sea correcta

/**
 * Props para el componente ThemeToggleButton.
 */
interface ThemeToggleButtonProps {
	className?: string; // Clases CSS adicionales para el botón.
	showText?: boolean; // Si es true, muestra el texto junto al icono.
}

/**
 * Botón que permite al usuario cambiar entre el tema claro y oscuro.
 */
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Componente ThemeToggleButton.
 */
const ThemeToggleButton = ({
	className = "",
	showText = false,
}: ThemeToggleButtonProps) => {
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
			// Se asegura de que la etiqueta <html> no tiene las clases 'light' y 'dark' aplicadas antes que el código añada
			// la correcta basada en 'mode'
			root.classList.remove("light", "dark");
			// Añade la clase 'mode' ('light' o 'dark') a <html>
			root.classList.add(mode);
			// Actualiza la variable 'mode' en localStorage
			localStorage.setItem("themeMode", mode);
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
			<span aria-hidden="true">🌙</span>
		) : (
			<span aria-hidden="true">☀️</span>
		);

	return (
		<Button
			className={`${styles.themeToggleBtn} ${className}`}
			onClick={toggleTheme}
			aria-label={
				mode === "light" ? "Activa el modo oscuro" : "Activa el modo claro"
			}
		>
			{icon}
			{showText && (
				<span className="ms-2">
					{mode === "light" ? "Modo Oscuro" : "Modo Claro"}
				</span>
			)}
		</Button>
	);
};

export default ThemeToggleButton;
