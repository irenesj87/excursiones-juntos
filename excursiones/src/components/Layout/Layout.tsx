import { useState, useCallback } from "react";
import { Container, Row } from "react-bootstrap";
import { Routes, Route, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Hero } from "../Hero/Hero";
import NavigationBar from "../NavigationBar";
import SearchBar from "../SearchBar/SearchBar";
import ExcursionsPage from "../ExcursionsPage";
import Excursion from "../Excursion/Excursion";
import Footer from "../Footer";
import ProtectedRoute from "../ProtectedRoute";
import LazyRouteWrapper from "../LazyRouteWrapper";
import RegisterPageSkeleton from "../RegisterPage/RegisterPageSkeleton";
import LoginPageSkeleton from "../LoginPage/LoginPageSkeleton";
import UserPageSkeleton from "../UserPage/UserPageSkeleton";
import { useAuth } from "../../hooks/useAuth";
import { useExcursions } from "../../hooks/useExcursions";
import { lazyWithMinTime } from "../../utils/lazyWithMinTime";
import { joinExcursion } from "../../services/excursionService";
import { RootState } from "../../store/store";
import styles from "./Layout.module.css";

/**
 * Lazy loading de los componentes RegisterPage, LoginPage y UserPage.
 * Se utiliza `lazyWithMinTime` para optimizar la carga de estos componentes.
 */
const RegisterPage = lazyWithMinTime(() => import("../RegisterPage"));
const LoginPage = lazyWithMinTime(() => import("../LoginPage"));
const UserPage = lazyWithMinTime(() => import("../UserPage"));

/**
 * Componente principal de la aplicación. Gestiona el estado de las excursiones, la autenticación del usuario y la
 * estructura general de la página.
 */
function Layout() {
	const location = useLocation();
	const isOnExcursionsPage =
		location.pathname === "/" || location.pathname === "/excursions";

	// Estado para controlar el valor del input de búsqueda en el Hero
	const [searchValue, setSearchValue] = useState("");

	// Se usa el hook useAuth para saber si ya se ha verificado si el usuario tiene una sesión activa.
	const { isAuthCheckComplete } = useAuth();

	// Se usa el hook useExcursions para obtener el estado completo de las excursiones, que contiene los datos, el estado
	// de carga y los errores.
	const {
		handleExcursionsFetchStart,
		handleExcursionsFetchSuccess,
		excursionsState,
		handleExcursionsFetchEnd,
	} = useExcursions();

	// Obtenemos el usuario del estado de Redux para saber si está logueado
	const user = useSelector((state: RootState) => state.loginReducer.user);
	const token = useSelector((state: RootState) => state.loginReducer.token);
	const isLoggedIn = Boolean(user);

	// Función para manejar la acción de unirse a una excursión desde la página de detalle
	const handleJoinExcursion = useCallback(
		async (id: string | number) => {
			if (!token || !user) return;

			await joinExcursion(user.mail, id, token);
		},
		[token, user],
	);

	return (
		<>
			{/* Componente de navegación. Se coloca arriba para una jerarquía visual correcta.
			 * Recibe props para interactuar con el estado de las excursiones y la autenticación.
			 */}
			<NavigationBar isOnExcursionsPage={isOnExcursionsPage} />

			{isOnExcursionsPage && (
				<Hero>
					<SearchBar
						id="hero-search-bar"
						onFetchSuccess={handleExcursionsFetchSuccess}
						onExcursionsFetchStart={handleExcursionsFetchStart}
						onExcursionsFetchEnd={handleExcursionsFetchEnd}
						searchValue={searchValue}
						onSearchChange={setSearchValue}
					/>
				</Hero>
			)}
			<div className={styles.layout}>
				{/* Contenedor principal que alberga el contenido de la página */}
				<main className={styles.mainContentWrapper}>
					<Container fluid className="d-flex flex-column flex-grow-1">
						<Row className="justify-content-start flex-grow-1 align-items-stretch">
							<Routes>
								{/* Define la ruta por defecto */}
								<Route
									path="/"
									element={<ExcursionsPage excursionsState={excursionsState} />}
								/>
								{/* Ruta para el listado explícito (necesaria para el botón "Volver") */}
								<Route
									path="excursions"
									element={<ExcursionsPage excursionsState={excursionsState} />}
								/>
								{/* Ruta de detalle de la excursión */}
								<Route
									path="excursions/:id"
									element={
										<Excursion
											isLoggedIn={isLoggedIn}
											onJoinAction={handleJoinExcursion}
										/>
									}
								/>
								{/* Define las rutas para los componentes RegisterPage, LoginPage y UserPage */}
								<Route
									path="registerPage"
									element={
										<LazyRouteWrapper
											PageComponent={RegisterPage}
											SkeletonComponent={RegisterPageSkeleton}
											pageProps={{}}
										/>
									}
								/>
								<Route
									path="loginPage"
									element={
										<LazyRouteWrapper
											PageComponent={LoginPage}
											SkeletonComponent={LoginPageSkeleton}
											pageProps={{}}
										/>
									}
								/>
								<Route
									path="userPage"
									element={
										// ProtectedRoute asegura que el usuario esté autenticado antes de acceder a UserPage, es decir,
										// restringe el acceso. Esto lo hace revisando el estado de autenticación del usuario (que se
										// gestiona con Redux en loginSlice).
										// Este componente tiene tres propósitos:
										// 1. Evita mostrar una página "rota": Impide que un usuario no autenticado vea una página de
										//    perfil vacía o con errores, ya que un usuario no autenticado (alguien que no ha iniciado
										//    sesión) podría escribir /userPage en el navegador y llegar a la página. Sin embargo, como
										//    no hay datos de usuario en el estado de Redux (state.loginReducer.user sería null), la
										//    página de perfil se mostraría vacía o con errores, pero nunca mostraría los datos de otro
										//    usuario. Su función aquí es mejorar la experiencia de usuario y mantener la lógica de
										//    acceso.
										// 2. Gestiona el flujo de autenticación: Si un usuario no logueado intenta acceder a /userPage,
										//    lo redirige de forma limpia a la página de inicio de sesión (/loginPage).
										// 3. Redirección inteligente: Guarda la página que el usuario intentaba visitar para que, una
										//    vez que inicie sesión, pueda ser redirigido de vuelta a su perfil automáticamente.
										<ProtectedRoute isAuthCheckComplete={isAuthCheckComplete}>
											<LazyRouteWrapper
												PageComponent={UserPage}
												SkeletonComponent={UserPageSkeleton}
												pageProps={{}}
											/>
										</ProtectedRoute>
									}
								/>
							</Routes>
						</Row>
					</Container>
				</main>
				<Footer />
			</div>
		</>
	);
}

export default Layout;
