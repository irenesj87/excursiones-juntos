import {
	useState,
	useEffect,
	useLayoutEffect,
	lazy,
	Suspense,
	useRef,
} from "react";
import { Container, Navbar } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { RootState } from "../../store/store";
import Logo from "../Logo";
import UserNavSkeleton from "../UserNav/UserNavSkeleton";
import GuestNavSkeleton from "../GuestNav/GuestNavSkeleton";
import ThemeToggleButton from "../ThemeToggleButton";
import styles from "./NavigationBar.module.css";
import "../../css/Themes.css";
import { ROUTES } from "../../constants";

// Estos componentes se cargan de forma perezosa.
const UserNav = lazy(() => import("../UserNav"));
const GuestNav = lazy(() => import("../GuestNav"));

/** Define cuantos píxeles debe bajar el usuario para que la barra de navegación cambie de transparente a sólida. */
const SCROLL_THRESHOLD = 10;

/**
 * Función que intenta adivinar si el usuario está autenticado basándose si existe un token en sessionStorage antes
 * de que Redux o la API respondan.
 * Esto se hace para mostrar un esqueleto de carga más acorde con la situación mientras se comprueba el
 * estado de autenticación real del usuario.
 * @returns	Un booleano que indica si probablemente el usuario está autenticado (true) o no (false).
 * @remarks	Esta función se ejecuta solo una vez al montar el componente, ya que se pasa como función inicializadora
 * a useState. Si se ejecutara en cada renderizado, podría causar problemas de rendimiento y comportamiento inesperado.
 */
const getInitialAuthState = () => {
	if (globalThis.window === undefined) {
		return false;
	}
	// Verificamos tanto el token directo como el fallback 'authState' para mantener la
	// consistencia con la lógica de recuperación de sesión de useAuth.
	return (
		!!sessionStorage.getItem("token") || !!sessionStorage.getItem("authState")
	);
};

/**
 * Componente para la barra de navegación.
 */
export function NavigationBar() {
	// Estado global de Redux para saber si el usuario está autenticado.
	const { login: isLoggedIn } = useSelector(
		(state: RootState) => state.loginReducer,
	);
	// Estado del contexto de autenticación para saber si la comprobación inicial de autenticación ha finalizado.
	// Dependiendo de ello se muestra el esqueleto para el invitado o para el usuario.
	const { isAuthCheckComplete } = useAuthContext();

	// Estado que indica si probablemente el usuario está autenticado basándonos en sessionStorage.
	const [likelyLoggedIn] = useState(getInitialAuthState);

	// Estado para controlar si la barra de navegación está en modo "scrolled" (sólida) o "top" (transparente).
	const [isScrolled, setIsScrolled] = useState(false);
	// Referencia al elemento DOM de la barra de navegación para medir su altura y actualizar la variable CSS.
	const navRef = useRef<HTMLElement>(null);

	const location = useLocation();
	// Detectamos si estamos en la Home para aplicar el estilo transparente
	const isHomePage = location.pathname === ROUTES.HOME;

	// Efecto para gestionar el cambio de estilo de la barra de navegación al hacer scroll en la página de inicio.
	useEffect(() => {
		// Si no estamos en la página de inicio, no hacemos nada y reseteamos el estado.
		if (!isHomePage) {
			setIsScrolled(false);
			return;
		}

		const handleScroll = () => {
			// Se activa el estado 'scrolled' si el scroll es mayor a 10px.
			setIsScrolled(globalThis.window.scrollY > SCROLL_THRESHOLD);
		};

		globalThis.window.addEventListener("scroll", handleScroll, {
			passive: true,
		});

		// Limpiamos el event listener al desmontar el componente.
		return () => globalThis.window.removeEventListener("scroll", handleScroll);
	}, [isHomePage]);

	/**
	 * Al ser la barra fixed y por lo tanto no ocupar espacio en el flujo normal, usamos useLayoutEffect para medir
	 * la altura de la barra de navegación después de que el DOM se haya actualizado,
	 * pero antes de que el navegador pinte la pantalla. Esto evita parpadeos.
	 * El resultado se guarda en --navbar-height.
	 * ¿Por qué se hace esto?: Como la barra es sticky, otros elementos de la página necesitan saber su altura para
	 * no quedar ocultos debajo de ella (especialmente el Hero o el contenido principal).
	 */
	useLayoutEffect(() => {
		// navRef.current: Referencia al elemento DOM de la barra de navegación.
		const navElement = navRef.current;
		if (!navElement) return;

		// Función para medir la altura actual de la barra de navegación (offsetHeight) y la guarda en la variable CSS.
		const updateHeight = () => {
			const height = navElement.offsetHeight;
			document.documentElement.style.setProperty(
				"--navbar-height",
				`${height}px`,
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
		/**
		 * Una vez se sabe si el usuario está autenticado, se muestra el contenido real.
		 * Se usa ErrorBoundary para capturar cualquier error en los componentes con carga perezosa.
		 * Si hay un error, se muestra el esqueleto correspondiente.
		 * El esqueleto de invitado se usa como fallback inicial mientras se carga el componente.
		 */
		return (
			<Suspense
				fallback={isLoggedIn ? <UserNavSkeleton /> : <GuestNavSkeleton />}
			>
				{isLoggedIn ? <UserNav /> : <GuestNav />}
			</Suspense>
		);
	};

	// Componente principal de la barra de navegación.
	const isTransparent = isHomePage && !isScrolled;
	return (
		<Navbar
			ref={navRef} // Referencia al elemento DOM de la barra de navegación.
			className={`${styles.customNavbar} ${isTransparent ? styles.transparentNavbar : ""}`} // Aplica el estilo transparente en la Home
			fixed="top"
		>
			{/* Usamos Container estándar en lugar de fluid para que el logo y el menú se alineen con el contenido central de la página (efecto "hoja") */}
			<Container className="d-flex justify-content-between align-items-center">
				{/* Logo. */}
				<Logo />
				{/* --- Contenedor de la derecha: tema y controles de usuario --- */}
				<div className="d-flex align-items-center ms-auto">
					{/* Botón de tema */}
					<ThemeToggleButton />
					{/* Contenido de navegación. */}
					<div className="d-flex align-items-center">{renderNavContent()}</div>
				</div>
			</Container>
		</Navbar>
	);
}
