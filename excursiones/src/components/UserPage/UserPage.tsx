import React from "react";
import { Row, Col } from "react-bootstrap";
import UserInfoForm from "../UserInfoForm";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./UserPage.module.css";

/**
 * Componente que representa la página de perfil del usuario.
 * La lógica de protección de esta ruta se maneja en el componente `ProtectedRoute`.
 */
const UserPage = (): JSX.Element => {
	return (
		// Se añade `h-100` a la Row y `d-flex flex-column` a la Col para asegurar que el layout
		// ocupe toda la altura disponible y que el contenido se organice verticalmente.
		// Esto empuja el footer hacia abajo, evitando la superposición.
		<Row as="main" className="justify-content-center pt-2 h-100">
			<Col xs={11} md={11} lg={11} xl={8} className="d-flex flex-column pb-5">
				<h2 className={`${styles.title} mb-3`}>Tu perfil</h2>
				<UserInfoForm />
			</Col>
		</Row>
	);
};

export default UserPage;
