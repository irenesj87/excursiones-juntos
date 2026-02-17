import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Hero } from "../Hero/Hero";
import NavigationBar from "../NavigationBar";
import SearchBar from "../SearchBar/SearchBar";
import { ExcursionsPage } from "../ExcursionsPage";
import Footer from "../Footer";
import ProtectedRoute from "../ProtectedRoute";
import { LazyRouteWrapper } from "../LazyRouteWrapper";
import RegisterPageSkeleton from "../RegisterPage/RegisterPageSkeleton";
import LoginPageSkeleton from "../LoginPage/LoginPageSkeleton";
import UserPageSkeleton from "../UserPage/UserPageSkeleton";
import { useAuth } from "../../hooks/useAuth";
import { useExcursions } from "../../hooks/useExcursions";
import { lazyWithMinTime } from "../../utils/lazyWithMinTime";
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
export function Layout() {
	const location = useLocation();
	const isOnExcursionsPage = location.pathname === "/";

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

	return (
		<div className={styles.layout}>
			<header>
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
			</header>
			{/* Contenedor principal que alberga el contenido de la página */}
			<main className={styles.mainContentWrapper}>
				<Routes>
					{/* Define la ruta por defecto. */}
					<Route
						path="/"
						element={<ExcursionsPage excursionsState={excursionsState} />}
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
			</main>
			<Footer />
		</div>
	);
}
