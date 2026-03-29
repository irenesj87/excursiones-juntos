import { RegisterForm } from "../RegisterForm";
import { FormPageLayout } from "../FormPageLayout/FormPageLayout";
import styles from "./RegisterPage.module.css";

/**
 * Constantes para los textos de la página para evitar literales sueltos.
 */
const PAGE_TITLE = "Bienvenido/a";
const PAGE_SUBTITLE = "Crea tu cuenta para empezar a explorar.";

/**
 * ID para el subtítulo, utilizado para vincularlo semánticamente con el formulario (WCAG AAA).
 */
const SUBTITLE_ID = "register-subtitle";

/**
 * Componente de página para el registro de nuevos usuarios.
 * Utiliza `FormPageLayout` para proporcionar un diseño consistente con otras páginas de formulario, y renderiza `RegisterForm`
 * dentro de este layout.
 */
function RegisterPage() {
	return (
		<FormPageLayout
			containerClassName={styles.pageContainer}
			title={PAGE_TITLE}
			subtitle={PAGE_SUBTITLE}
			subtitleId={SUBTITLE_ID}
		>
			<RegisterForm />
		</FormPageLayout>
	);
}

export default RegisterPage;
