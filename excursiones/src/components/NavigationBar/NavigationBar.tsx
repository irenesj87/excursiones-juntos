import React, {
	useState,
	useLayoutEffect,
	lazy,
	Suspense,
	useRef,
} from "react";
import { Container, Navbar, Offcanvas } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useAuthContext } from "../../context/AuthContext";
import { RootState } from "../../store/store";
import Logo from "../Logo";
import SearchBar from "../SearchBar";
import UserNavSkeleton from "../UserNav/UserNavSkeleton";
import GuestNavSkeleton from "../GuestNav/GuestNavSkeleton";
import ThemeToggleButton from "../ThemeToggleButton";
import styles from "./NavigationBar.module.css";
import "../../css/Themes.css";
import { Excursion } from "../../types";

// Estos componentes se cargan de forma perezosa (lazy).
const UserNav = lazy(() => import("../UserNav"));
const GuestNav = lazy(() => import("../GuestNav"));

const getInitialAuthState = () => {
	if (globalThis.window === undefined) {
		return false;
	}
	return !!sessionStorage.getItem("token");
};

interface NavigationBarProps {
	/** Función para actualizar el estado de la lista de excursiones. */
	onFetchSuccess: (excursions: readonly Excursion[]) => void;
	/** Callback que se ejecuta al iniciar la búsqueda de excursiones. */
	onExcursionsFetchStart: () => void;
	/** Callback que se ejecuta al finalizar la búsqueda de excursiones. */
	onExcursionsFetchEnd: (error: Error | null) => void;
	/** Indica si la página actual es la de excursiones. */
	isOnExcursionsPage: boolean;
}

/**
 * Componente para la barra de navegación.
 */
const NavigationBar = ({
	onFetchSuccess,
	onExcursionsFetchStart,
	onExcursionsFetchEnd,
	isOnExcursionsPage,
}: NavigationBarProps) => {
	// Estado global de Redux para saber si el usuario está autenticado.
	const { login: isLoggedIn } = useSelector(
		(state: RootState) => state.loginReducer
	);
	// Estado del contexto de autenticación para saber si la comprobación inicial de autenticación ha finalizado.
	// Dependiendo de ellos se muestra el esuqeleto para el invitado o para el usuario
	const { isAuthCheckComplete } = useAuthContext();

	// Estado que indica si probablemente el usuario está autenticado basándonos en sessionStorage.
	const [likelyLoggedIn] = useState(getInitialAuthState);

	/** Estado que guarda el texto que el usuario escribe en la barra de búsqueda. */
	const [searchTerm, setSearchTerm] = useState("");
	/** Estado para controlar la visibilidad del componente Offcanvas (menú lateral). */
	const [showMenu, setShowMenu] = useState(false);
	const navRef = useRef<HTMLElement>(null);

	// Usamos useLayoutEffect para medir la altura de la barra de navegación después de que el DOM se haya actualizado,
	// pero antes de que el navegador pinte la pantalla. Esto evita parpadeos.
	// El resultado se guarda en --navbar-height.
	// ¿Por qué se hace esto?: Como la barra es sticky, otros elementos de la página necesitan saber su altura para no quedar
	// ocultos debajo de ella.
	useLayoutEffect(() => {
		// navRef.current: Referencia al elemento DOM de la barra de navegación.
		const navElement = navRef.current;
		if (!navElement) return;

		// Función para medir la altura actual de la barra de navegación (offsetHeight) y la guarda en la variable CSS.
		const updateHeight = () => {
			const height = navElement.offsetHeight;
			document.documentElement.style.setProperty(
				"--navbar-height",
				`${height}px`
			);
		};

		// El ResizeObserver es la forma moderna y eficiente de reaccionar a cambios de tamaño.
		const observer = new ResizeObserver(() => {
			// Si la altura de la barra de navegación cambia se vuelve a ejecutar la función updateHeight.
			globalThis.requestAnimationFrame(updateHeight);
		});

		updateHeight(); // Medimos la altura inicial
		// Iniciamos la observación de cambios de tamaño en el elemento de la barra de navegación.
		observer.observe(navElement);

		// Limpiamos el observador cuando el componente se desmonta para evitar fugas de memoria.
		return () => observer.disconnect();
	}, []);

	/** Cierra el menú lateral (Offcanvas). */
	const handleCloseMenu = () => setShowMenu(false);

	/** Abre el menú lateral (Offcanvas). */
	const handleShowMenu = () => setShowMenu(true);

	const renderNavContent = () => {
		// Mientras no se sabe si el usuario está autenticado, se muestra un esqueleto de carga.
		// Depende de likelyLoggedIn. Si es true, se muestra el esqueleto de usuario, si es false, el de invitado.
		if (!isAuthCheckComplete) {
			return (
				<div className="d-flex align-items-center">
					<div className="ms-2">
						{likelyLoggedIn ? <UserNavSkeleton /> : <GuestNavSkeleton />}
					</div>
				</div>
			);
		}
		// Una vez se sabe si el usuario está autenticado, se muestra el contenido real.
		// Se usa ErrorBoundary para capturar cualquier error en los componentes lazy-loaded.
		// Si hay un error, se muestra el esqueleto correspondiente.
		// El esqueleto de invitado se usa como fallback inicial mientras se carga el componente.
		// Si el usuario está autenticado, se muestra UserNav, si no, GuestNav.
		// Ambos reciben la función handleCloseMenu para cerrar el menú al hacer alguna acción.
		return (
			<Suspense
				fallback={isLoggedIn ? <UserNavSkeleton /> : <GuestNavSkeleton />}
			>
				{isLoggedIn ? (
					<UserNav onCloseMenu={handleCloseMenu} />
				) : (
					<GuestNav onCloseMenu={handleCloseMenu} variant="default" />
				)}
			</Suspense>
		);
	};

	// Componente principal de la barra de navegación.
	return (
		<Navbar
			ref={navRef} // Referencia al elemento DOM de la barra de navegación.
			expand="lg" // El menú se expande en breakpoints grandes.
			className={`${styles.customNavbar} ${
				// Se comprueba si estamos en la página de excursiones para saber si tenemos que eliminar el borde inferior.
				isOnExcursionsPage ? styles.onExcursionsPage : ""
			}`}
			sticky="top"
		>
			<Container fluid>
				{/* Agrupados con d-flex */}
				<div className="d-flex flex-wrap align-items-center">
					{/* Logo (siempre visible) */}
					<Navbar.Brand onClick={handleCloseMenu}>
						<Logo />
					</Navbar.Brand>
				</div>
				{/* --- Barra de búsqueda --- */}
				<div className="d-none d-md-flex justify-content-center flex-grow-1 px-md-3 px-lg-5 order-md-2 order-lg-2 me-md-3">
					<div style={{ maxWidth: "900px", width: "100%" }}>
						<SearchBar
							onFetchSuccess={onFetchSuccess} //Se pasa la función onFetchSuccess al componente SearchBar
							id="searchBar-md-lg"
							onExcursionsFetchStart={onExcursionsFetchStart}
							onExcursionsFetchEnd={onExcursionsFetchEnd}
							searchValue={searchTerm}
							onSearchChange={setSearchTerm}
						/>
					</div>
				</div>
				{/* --- Contenedor de la derecha: controles de usuario, tema y menú --- */}
				<div className="d-flex align-items-center ms-auto ms-md-0 order-md-3 order-lg-3">
					{/* Botón de tema */}
					<ThemeToggleButton />

					{/* Contenido de navegación para breakpoints grandes (lg y superior) */}
					<div className="d-none d-lg-flex align-items-center">
						{renderNavContent()}
					</div>

					{/* Botón para abrir el menú Offcanvas (solo visible en pantallas pequeñas) */}
					<Navbar.Toggle
						aria-controls="offcanvasNavbar"
						label="Abrir menú de navegación"
						onClick={handleShowMenu}
						className={`d-lg-none ${styles.navbarToggler}`}
					/>
				</div>
				{/* Barra de búsqueda en breakpoints pequeños. Ocupa toda la anchura */}
				{/* order-last: Asegura que esté al final del contenedor */}
				<div className="d-md-none w-100 mt-2 order-last">
					<SearchBar
						onFetchSuccess={onFetchSuccess}
						id="searchBar-sm"
						onExcursionsFetchStart={onExcursionsFetchStart}
						onExcursionsFetchEnd={onExcursionsFetchEnd}
						searchValue={searchTerm}
						onSearchChange={setSearchTerm}
					/>
				</div>
				{/* --- Componente Offcanvas --- */}
				<Offcanvas
					show={showMenu}
					onHide={handleCloseMenu}
					placement="end"
					id="offcanvasNavbar"
					scroll={true}
					className={styles.offcanvasMenu}
					backdrop={true}
					aria-label="Menú"
				>
					<Offcanvas.Header closeButton closeLabel="Cerrar menú">
						<Offcanvas.Title>Menú</Offcanvas.Title>
					</Offcanvas.Header>
					<Offcanvas.Body>
						{/* 
							Se replica la lógica de `renderNavContent` para el menú Offcanvas.
							Esto asegura que los usuarios logueados vean `UserNav` y los invitados `GuestNav`.
							Se usa Suspense para manejar la carga perezosa de los componentes.
						*/}
						<Suspense
							fallback={isLoggedIn ? <UserNavSkeleton /> : <GuestNavSkeleton />}
						>
							{isLoggedIn ? (
								<UserNav onCloseMenu={handleCloseMenu} />
							) : (
								<GuestNav onCloseMenu={handleCloseMenu} variant="offcanvas" />
							)}
						</Suspense>
					</Offcanvas.Body>
				</Offcanvas>
			</Container>
		</Navbar>
	);
};

export default NavigationBar;
