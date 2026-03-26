import { Row, Col } from "react-bootstrap";
import { FormPageLayout } from "../FormPageLayout";
import { useSkeletonTheme } from "../../hooks/useSkeletonTheme";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import registerFormStyles from "../RegisterForm/RegisterForm.module.css";
import { PASSWORD_REQUIREMENTS } from "../../validation/validations";

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
 * Esqueleto de carga cuya función es mostrar una versión simplificada del formulario de registro mientras el
 * componente real (RegisterForm.js) se está cargando.
 */
function RegisterPageSkeleton() {
	const { baseColor, highlightColor } = useSkeletonTheme();

	/**
	 * Renderiza un marcador de posición para un campo de entrada del formulario.
	 */
	const renderInputPlaceholder = (labelWidth: string) => (
		<div className="mb-3">
			<Skeleton
				width={labelWidth}
				height={18}
				containerClassName="form-label d-block"
			/>
			<Skeleton height={50} borderRadius="var(--border-radius-md)" />
		</div>
	);

	return (
		// Utiliza FormPageLayout para mantener la estructura del formulario de registro.
		<FormPageLayout
			title="Bienvenido/a"
			subtitle="Crea tu cuenta para empezar a explorar."
		>
			<SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
				<div aria-hidden="true" className={registerFormStyles.registerForm}>
					<div className={registerFormStyles.fieldsContainer}>
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
						<p className="mb-1">
							<Skeleton width="70%" />
						</p>
						<ul className="mb-0 list-unstyled" aria-hidden="true">
							{PASSWORD_REQUIREMENTS.map((req, index) => (
								<li
									key={req.message}
									className="d-flex align-items-center gap-2 mb-1"
								>
									<div className={registerFormStyles.requirementIcon}>
										<Skeleton
											circle
											width={14}
											height={14}
											containerClassName="d-inline-flex"
										/>
									</div>
									{/* Skeletons con anchos específicos para simular los textos reales 
									(8 caracteres, un número, una mayúscula, etc.) */}
									<Skeleton width={[110, 85, 130, 95][index % 4]} height={12} />
								</li>
							))}
						</ul>
					</div>
					{/* Esqueleto para el botón de envío. Usamos el mismo contenedor que en el real. */}
					<div className="d-grid d-sm-flex justify-content-sm-end">
						<Skeleton
							height={44}
							className="w-100"
							borderRadius="var(--border-radius-pill)"
							style={{ minWidth: 85 }}
						/>
					</div>
				</div>
			</SkeletonTheme>
		</FormPageLayout>
	);
}

export default RegisterPageSkeleton;
