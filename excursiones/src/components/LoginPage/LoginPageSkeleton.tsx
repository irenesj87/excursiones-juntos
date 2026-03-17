import { Row, Col } from "react-bootstrap";
import { ROUTES } from "../../constants";
import { LOGIN_PAGE_TEXT } from "./loginConstants";
import { FormPageLayout } from "../FormPageLayout";
import { useSkeletonTheme } from "../../hooks/useSkeletonTheme";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import loginFormStyles from "../LoginForm/LoginForm.module.css";

const INPUT_SKELETON_HEIGHT = 50;
const BUTTON_SKELETON_HEIGHT = 44;
const BUTTON_MIN_WIDTH = 85;
const INPUT_SKELETON_WIDTH = "40%";

/** Subcomponente para renderizar el placeholder de un input para evitar funciones inline */
function InputPlaceholderSkeleton() {
	return (
		<div>
			<Skeleton
				width={INPUT_SKELETON_WIDTH}
				containerClassName="d-block mb-2"
			/>
			<Skeleton
				height={INPUT_SKELETON_HEIGHT}
				borderRadius="var(--border-radius-md)"
			/>
		</div>
	);
}

/**
 * Componente que muestra un esqueleto de carga para la página de inicio de sesión.
 * Simula la estructura del formulario de login mientras los componentes reales se cargan.
 */
function LoginPageSkeleton(): React.ReactElement {
	const { baseColor, highlightColor } = useSkeletonTheme();

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
						<InputPlaceholderSkeleton />
						<InputPlaceholderSkeleton />
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
								height={BUTTON_SKELETON_HEIGHT}
								className="w-100"
								borderRadius="var(--border-radius-pill)"
								style={{ minWidth: BUTTON_MIN_WIDTH }}
							/>
						</Col>
					</Row>
				</div>
			</SkeletonTheme>
		</FormPageLayout>
	);
}

export default LoginPageSkeleton;
