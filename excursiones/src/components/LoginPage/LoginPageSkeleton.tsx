import { Row, Col } from "react-bootstrap";
import { ROUTES, LOGIN_PAGE_TEXT } from "../../constants";
import FormPageLayout from "../FormPageLayout/FormPageLayout";
import { useSkeletonTheme } from "../../hooks/useSkeletonTheme";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import loginFormStyles from "../LoginForm/LoginForm.module.css";

/**
 * Componente que muestra un esqueleto de carga para la página de inicio de sesión.
 * Simula la estructura del formulario de login mientras los componentes reales se cargan.
 */
function LoginPageSkeleton(): React.ReactElement{
	const { baseColor, highlightColor } = useSkeletonTheme();

	/** Renderiza un placeholder para un campo de formulario (etiqueta(label) + input). */
	const renderInputPlaceholder = () => (
		<div>
			<Skeleton width="40%" containerClassName="d-block mb-2" />
			<Skeleton height={50} borderRadius="var(--border-radius-md)" />
		</div>
	);

	return (
		// Utiliza FormPageLayout para mantener la estructura de la página de inicio de sesión.
		<FormPageLayout
			title={LOGIN_PAGE_TEXT.TITLE}
			colWidth="3"
			subtitle={LOGIN_PAGE_TEXT.SUBTITLE}
			switcher={{
				prompt: LOGIN_PAGE_TEXT.SWITCHER_PROMPT,
				linkText: LOGIN_PAGE_TEXT.SWITCHER_LINK_TEXT,
				linkTo: ROUTES.REGISTER,
			}}
		>
			<SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
				<div aria-hidden="true" className={loginFormStyles.formLabel}>
					<div className={loginFormStyles.fieldsContainer}>
						{renderInputPlaceholder()}
						{renderInputPlaceholder()}
					</div>
					{/* Esqueleto para el botón de envío */}

					<Row className="justify-content-sm-end">
						<Col xs={12} sm="auto">
							{/*
							  Para el esqueleto del botón, necesitamos un comportamiento responsivo:
							  - En breakpoints pequeños 'xs', debe ocupar el 100% del ancho (como el botón real).
							  - En breakpoints más grandes, debe tener un ancho fijo para simular el botón.
							  - La clase `w-100` asegura el ancho completo, y el `min-width` en el estilo evita que la 
							  	columna `sm="auto"` colapse en breakpoints grandes.
							*/}
							<Skeleton
								height={44}
								className="w-100"
								borderRadius="var(--border-radius-pill)"
								style={{ minWidth: 85 }}
							/>
						</Col>
					</Row>
				</div>
			</SkeletonTheme>
		</FormPageLayout>
	);
}

export default LoginPageSkeleton;
