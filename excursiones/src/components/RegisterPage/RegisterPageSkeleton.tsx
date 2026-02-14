import { Row, Col } from "react-bootstrap";
import { FormPageLayout } from "../FormPageLayout";
import { useSkeletonTheme } from "../../hooks/useSkeletonTheme";
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
function RegisterPageSkeleton() {
	const { baseColor, highlightColor } = useSkeletonTheme();

	/**
	 * Renderiza un marcador de posición para un campo de entrada del formulario.
	 */
	const renderInputPlaceholder = (labelWidth: string) => (
		// El contenedor necesita un gap o un margin-bottom para espaciar los campos
		<div>
			<Skeleton width={labelWidth} containerClassName="d-block mb-2" />
			<Skeleton height={50} borderRadius="var(--border-radius-md)" />
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
				<div aria-hidden="true" className={registerFormStyles.formLabel}>
					<div className={`${registerFormStyles.fieldsContainer} mb-5`}>
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
					</div>

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

export default RegisterPageSkeleton;
