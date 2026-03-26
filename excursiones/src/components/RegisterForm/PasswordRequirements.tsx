import { PASSWORD_REQUIREMENTS } from "../../validation/validations";
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

export function PasswordRequirements({
	password = "",
}: PasswordRequirementsProps) {
	return (
		<div id="password-requirements" className={`${styles.infoMessage} mb-3`}>
			<p className="mb-1">Tu contraseña debe tener al menos:</p>
			<ul className="mb-0">
				{PASSWORD_REQUIREMENTS.map((req) => {
					const isMet = req.isValid(password);
					/**
					 * Limpiamos el mensaje para evitar redundancia con el título "debe tener al menos:".
					 * Eliminamos "al menos" o "debe tener al menos" del inicio y capitalizamos.
					 */
					const cleanMessage = req.message
						.trim()
						.replace(/^(debe tener al menos)\s+/i, "");

					const displayMessage =
						cleanMessage.charAt(0).toUpperCase() + cleanMessage.slice(1);

					return (
						<li
							key={req.message}
							className={cn({ [styles.requirementMet]: isMet })}
						>
							<span className="visually-hidden">
								{isMet ? "Cumplido: " : "Pendiente: "}
							</span>
							<div className={styles.requirementIcon}>
								{isMet ? (
									/* Solo animamos el CheckIcon cuando aparece usando la key */
									<CheckIcon
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
							{displayMessage}
						</li>
					);
				})}
			</ul>
		</div>
	);
}
