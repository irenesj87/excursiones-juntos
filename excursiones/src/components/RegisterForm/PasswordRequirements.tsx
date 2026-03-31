import {
	PASSWORD_RULES,
	MIN_PASSWORD_LENGTH,
} from "../../validation/validations";
import styles from "./RegisterForm.module.css";
import { CheckIcon } from "../../ui/Icons";
import cn from "classnames";

/**
 * Componente que muestra los requisitos de seguridad para la contraseña.
 * @param password - Valor actual de la contraseña para validar en tiempo real.
 */
interface PasswordRequirementsProps {
	readonly password?: string;
}

/**
 * Definición de los requisitos de contraseña con su etiqueta y función de validación correspondiente.
 */
const REQUIREMENTS_DATA = [
	{
		label: `${MIN_PASSWORD_LENGTH} caracteres`,
		isValid: PASSWORD_RULES.hasMinLength,
	},
	{
		label: "una letra",
		isValid: PASSWORD_RULES.hasLetter,
	},
	{
		label: "un número",
		isValid: PASSWORD_RULES.hasNumber,
	},
	{
		label: "un carácter especial (ej: @$!%*?&.,_-)",
		isValid: PASSWORD_RULES.hasSpecialChar,
	},
];

export function PasswordRequirements({
	password = "",
}: PasswordRequirementsProps) {
	return (
		<div id="password-requirements" className={`${styles.infoMessage} mb-3`}>
			<p className="mb-1">Tu contraseña debe tener al menos:</p>
			<ul className="mb-0">
				{/* Recorremos cada requisito y verificamos si se cumple con la contraseña actual. 
				Aplicamos estilos condicionales para indicar visualmente el estado de cada requisito. */}
				{REQUIREMENTS_DATA.map((req) => {
					const isMet = req.isValid(password);

					return (
						<li
							key={req.label}
							/* Si el requisito se cumple, aplicamos el estilo que lo resalta. */
							className={cn({ [styles.requirementMet]: isMet })}
						>
							<span className="visually-hidden">
								{isMet ? "Cumplido: " : "Pendiente: "}
							</span>
							<div className={styles.requirementIcon}>
								{isMet ? (
									<CheckIcon
										/* La key es necesaria para que React lo trate como un elemento nuevo cuando aparece
										lo que dispara la animación CSS. */
										key="check"
										size={14}
										aria-hidden="true"
										className={styles.popAnimation}
									/>
								) : (
									<svg
										key="dot"
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="currentColor"
										aria-hidden="true"
									>
										<circle cx="12" cy="12" r="3" />
									</svg>
								)}
							</div>
							{req.label}
						</li>
					);
				})}
			</ul>
		</div>
	);
}
