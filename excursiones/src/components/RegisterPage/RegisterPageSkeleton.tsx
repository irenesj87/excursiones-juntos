import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import FormPageLayout from "../FormPageLayout/FormPageLayout";
import { RootState } from "../../store/store";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import registerFormStyles from "../RegisterForm/RegisterForm.module.css";

/**
 * Configuración para las filas del esqueleto del formulario. Cada sub-array representa una fila
 * y cada objeto dentro de él representa una columna con el ancho de la etiqueta del esqueleto.
 */
const skeletonFieldRows = [
	[{ labelWidth: "30%" }, { labelWidth: "40%" }], // Nombre, Apellidos
	[{ labelWidth: "35%" }, { labelWidth: "50%" }], // Teléfono, Correo
	[{ labelWidth: "40%" }, { labelWidth: "60%" }], // Contraseña, Repetir contraseña
];

/**
 * Esqueleto de carga cuya función es mostrar una versión simplificada del formulario de registro mientras el componente real
 * (RegisterForm.js) se está cargando.
 */
const RegisterPageSkeleton = () => {
	const mode = useSelector((state: RootState) => state.themeReducer.mode);

	// Define los colores del esqueleto según el tema para una experiencia visual consistente.
	const baseColor = mode === "dark" ? "#202020" : "#e0e0e0";
	const highlightColor = mode === "dark" ? "#444" : "#f5f5f5";

	/**
	 * Renderiza un marcador de posición para un campo de entrada del formulario.
	 */
	const renderInputPlaceholder = (labelWidth: string) => (
		<div className="mb-3">
			<Skeleton width={labelWidth} containerClassName="d-block mb-2" />
			<Skeleton height={38} />
		</div>
	);

	return (
		// Utiliza FormPageLayout para mantener la estructura del formulario de registro.
		<FormPageLayout
			title="Bienvenido/a"
			subtitle="Crea tu cuenta para empezar a explorar."
			switcher={{
				prompt: "¿Ya tienes una cuenta?",
				linkText: "Inicia sesión",
				linkTo: "/loginPage",
			}}
		>
			<SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
				<div
					aria-hidden="true"
					className={`${registerFormStyles.formLabel} fw-bold`}
				>
					{skeletonFieldRows.map((row, rowIndex) => (
						// Usamos el índice como clave porque la lista es estática y no cambiará.
						// eslint-disable-next-line react/no-array-index-key
						<Row key={`skeleton-row-${rowIndex}`}>
							{row.map((col, colIndex) => (
								// eslint-disable-next-line react/no-array-index-key
								<Col xs={12} md={6} key={`skeleton-col-${colIndex}`}>
									{renderInputPlaceholder(col.labelWidth)}
								</Col>
							))}
						</Row>
					))}

					{/* Esqueleto para el mensaje informativo de la contraseña. */}
					<div className={`${registerFormStyles.infoMessage} mb-3`}>
						<p className="mb-1 fw-normal">
							<Skeleton width="70%" />
						</p>
						<ul className="mb-0 ps-3 fw-normal">
							<li>
								<Skeleton width="40%" />
							</li>
							<li>
								<Skeleton width="35%" />
							</li>
							<li>
								<Skeleton width="35%" />
							</li>
							<li>
								<Skeleton width="60%" />
							</li>
						</ul>
					</div>
					{/* Esqueleto para el botón de envío */}
					<Row className="justify-content-sm-end">
						<Col xs={12} sm="auto">
							<Skeleton
								height={44}
								className="w-100"
								style={{ minWidth: 85 }}
							/>
						</Col>
					</Row>
				</div>
			</SkeletonTheme>
		</FormPageLayout>
	);
};

export default RegisterPageSkeleton;
