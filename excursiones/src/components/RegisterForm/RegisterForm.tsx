import { useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { ValidatedInput } from "../../ui/ValidatedInput";
import { Alert } from "../../ui/Alert";
import { Button } from "../../ui/Button";
import { useRegisterForm } from "./useRegisterForm";
import { PasswordRequirements } from "./PasswordRequirements";
import styles from "./RegisterForm.module.css";

/**
 * Componente de formulario de registro de usuario.
 */
export function RegisterForm() {
	/** Utiliza el hook de formulario de registro */
	const {
		values,
		formFieldsConfig,
		formState,
		formDispatch,
		handleSubmit: apiSubmit,
		handleInputChange,
	} = useRegisterForm();

	const [isSubmitted, setIsSubmitted] = useState(false);

	/** Maneja el envío y activa la validación global. */
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSubmitted(true);
		apiSubmit(event);
	};

	return (
		<>
			{/* Muestra un mensaje de error si existe */}
			{formState.error && (
				<Alert
					variant="danger"
					message={formState.error}
					onClose={() => formDispatch({ type: "CLEAR_ERROR" })}
				/>
			)}
			{/* Formulario de registro */}
			<Form
				id="registerForm"
				className={styles.registerForm}
				/* Evita el comportamiento de validación nativo del navegador para manejarlo con ValidatedInput */
				noValidate
				/* El atributo aria-busy indica a los lectores de pantalla que el formulario está procesando una
				 * acción, como el envío, para mejorar la accesibilidad. */
				aria-busy={formState.isLoading}
				onSubmit={handleSubmit}
			>
				<div className={styles.fieldsContainer}>
					{/* Itera sobre la configuración de campos para renderizar los inputs correspondientes. 
					Cada fila puede contener uno o dos campos, dependiendo del diseño. */}
					{formFieldsConfig.map((row) => (
						//La clave de cada fila se genera a partir de los IDs de los campos que contiene para asegurar unicidad.
						<Row key={row.map((f) => f.id).join("-")}>
							{row.map(({ ref, field, ...fieldProps }) => (
								<Col xs={12} md={6} key={fieldProps.id}>
									<ValidatedInput
										{...fieldProps}
										ref={ref}
										value={values[field]}
										inputToChange={(value) => handleInputChange(field, value)}
										message={isSubmitted}
									/>
								</Col>
							))}
						</Row>
					))}
				</div>
				<PasswordRequirements password={values.password} />
				<div className="d-grid d-sm-flex justify-content-sm-end">
					<Button
						type="submit"
						variant="primary"
						isLoading={formState.isLoading}
					>
						Enviar
					</Button>
				</div>
			</Form>
		</>
	);
}
