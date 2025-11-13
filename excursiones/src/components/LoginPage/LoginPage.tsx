import React from "react";
import LoginForm from "../LoginForm";
import FormPageLayout from "../FormPageLayout/FormPageLayout";
import { ROUTES, LOGIN_PAGE_TEXT } from "../../constants";
import "bootstrap/dist/css/bootstrap.css";

/**
 * Componente que representa la página de inicio de sesión.
 * Utiliza el layout de formulario genérico y renderiza el formulario de login.
 */
const LoginPage = () => {
	return (
		<FormPageLayout
			title={LOGIN_PAGE_TEXT.TITLE}
			subtitle={LOGIN_PAGE_TEXT.SUBTITLE}
			colWidth="3"
			switcher={{
				prompt: LOGIN_PAGE_TEXT.SWITCHER_PROMPT,
				linkText: LOGIN_PAGE_TEXT.SWITCHER_LINK_TEXT,
				linkTo: ROUTES.REGISTER,
			}}
		>
			<LoginForm />
		</FormPageLayout>
	);
};

export default LoginPage;
