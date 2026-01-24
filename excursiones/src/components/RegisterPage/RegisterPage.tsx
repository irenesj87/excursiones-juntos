import React from "react";
import RegisterForm from "../RegisterForm";
import FormPageLayout from "../FormPageLayout/FormPageLayout";
import styles from "./RegisterPage.module.css";

/**
 * Componente que representa la página de registro de usuarios.
 * Utiliza `FormPageLayout` para proporcionar un diseño consistente con otras páginas de formulario, y renderiza `RegisterForm`
 * dentro de este layout.
 */
function RegisterPage(){
	return (
		<FormPageLayout
			containerClassName={styles.pageContainer}
			title="Bienvenido/a"
			subtitle="Crea tu cuenta para empezar a explorar."
			switcher={{
				prompt: "¿Ya tienes una cuenta?",
				linkText: "Inicia sesión",
				linkTo: "/loginPage",
			}}
		>
			<RegisterForm />
		</FormPageLayout>
	);
}

export default RegisterPage;
