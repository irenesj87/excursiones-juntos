import { Routes, Route, useLocation } from "react-router-dom";
import { Hero } from "../Hero/Hero";
import { NavigationBar } from "../NavigationBar";
import { ExcursionsPage } from "../ExcursionsPage";
import { Footer } from "../Footer";
import { AboutUs } from "../AboutUs";
import ProtectedRoute from "../ProtectedRoute";
import {
	LazyRouteWrapper,
	EMPTY_PAGE_PROPS,
} from "../LazyRouteWrapper/LazyRouteWrapper";
import RegisterPageSkeleton from "../RegisterPage/RegisterPageSkeleton";
import LoginPageSkeleton from "../LoginPage/LoginPageSkeleton";
import UserPageSkeleton from "../UserPage/UserPageSkeleton";
import { useAuth } from "../../hooks/useAuth";
import { lazyWithMinTime } from "../../utils/lazyWithMinTime";
import styles from "./Layout.module.css";

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

	// Se usa el hook useAuth para saber si ya se ha verificado si el usuario tiene una sesión activa.
	const { isAuthCheckComplete } = useAuth();

	return (
		<div className={styles.layout}>
			<header>
				{/* Componente de navegación. Recibe props para interactuar con el estado de las excursiones y la autenticación. */}
				<NavigationBar />

				{isOnExcursionsPage && <Hero />}
			</header>
			{/* Contenedor principal que alberga el contenido de la página */}
			<main
				className={
					isOnExcursionsPage
						? `${styles.mainContentWrapper} ${styles.noPaddingTop}`
						: styles.mainContentWrapper
				}
			>
				{/* Sección "Sobre Nosotros" - Solo visible en la página de inicio */}
				{isOnExcursionsPage && <AboutUs />}

				<div className={styles.pageContainer}>
					<Routes>
						{/* Define la ruta por defecto. */}
						<Route path="/" element={<ExcursionsPage />} />
						{/* Define las rutas para los componentes RegisterPage, LoginPage y UserPage */}
						<Route
							path="registerPage"
							element={
								<LazyRouteWrapper
									PageComponent={RegisterPage}
									SkeletonComponent={RegisterPageSkeleton}
									pageProps={EMPTY_PAGE_PROPS}
								/>
							}
						/>
						<Route
							path="loginPage"
							element={
								<LazyRouteWrapper
									PageComponent={LoginPage}
									SkeletonComponent={LoginPageSkeleton}
									pageProps={EMPTY_PAGE_PROPS}
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
										pageProps={EMPTY_PAGE_PROPS}
									/>
								</ProtectedRoute>
							}
						/>
					</Routes>
				</div>
			</main>
			<Footer />
		</div>
	);
}
