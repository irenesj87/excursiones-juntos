import {
	useState,
	useLayoutEffect,
	useEffect,
	lazy,
	Suspense,
	useRef,
} from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { RootState } from "../../store/store";
import { cn } from "../../lib/utils";
import { Logo } from "../Logo";
import UserNavSkeleton from "../UserNav/UserNavSkeleton";
import GuestNavSkeleton from "../GuestNav/GuestNavSkeleton";
import { ThemeToggleButton } from "../ThemeToggleButton";
import { ROUTES } from "../../constants";

// Estos componentes se cargan de forma perezosa.
const UserNav = lazy(() => import("../UserNav"));
const GuestNav = lazy(() => import("../GuestNav"));

/**
 * Función que intenta adivinar si el usuario está autenticado basándonos en si existe un token en sessionStorage
 * antes de que la comprobación oficial de la API termine.
 *
 * Esto permite mostrar el esqueleto (skeleton) correcto y evitar parpadeos visuales.
 * @returns Un booleano que indica si probablemente el usuario tiene sesión.
 */
const getInitialAuthState = () => {
	if (globalThis.window === undefined) {
		return false;
	}
	// Verificamos tanto el token directo como el objeto authState por compatibilidad.
	try {
		const token = sessionStorage.getItem("token");
		const authState = sessionStorage.getItem("authState");
		return !!token || !!authState;
	} catch {
		return false;
	}
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

	const location = useLocation();
	// Detectamos si estamos en la Home para aplicar el estilo transparente.
	// Debe declararse antes de ser usado en el inicializador de isScrolled.
	const isHomePage = location.pathname === ROUTES.HOME;

	// Referencia al elemento DOM de la barra de navegación para medir su altura y actualizar la variable CSS.
	const navRef = useRef<HTMLElement>(null);

	// Estado para controlar si el usuario ha hecho scroll.
	const [isScrolled, setIsScrolled] = useState(false);

	/**
	 * Escuchamos el evento de scroll para cambiar el estado de la barra.
	 * Se activa al primer píxel de scroll para garantizar que la transición gane al movimiento rápido.
	 */
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 0);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	/**
	 * Medimos la altura de la barra para que otros elementos puedan posicionarse
	 * correctamente si fuera necesario, aunque ya no sea fija.
	 */
	useLayoutEffect(() => {
		const navElement = navRef.current;
		if (!navElement) return;

		const updateHeight = () => {
			document.documentElement.style.setProperty(
				"--navbar-height",
				`${navElement.offsetHeight}px`,
			);
		};
		updateHeight();
	}, []);

	/**
	 * Renderiza el contenido de la derecha de la barra de navegación.
	 * Gestiona los estados de carga (skeletons) y la carga perezosa de los menús.
	 */
	const renderNavContent = () => {
		// Mientras no se sabe si el usuario está autenticado, se muestra un esqueleto de carga.
		// Depende de likelyLoggedIn. Si es true, se muestra el esqueleto de usuario, si es false, el de invitado.
		if (!isAuthCheckComplete) {
			return (
				<div className="flex items-center">
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
	return (
		<nav
			ref={navRef}
			className={cn(
				"fixed top-0 left-0 right-0 z-50 flex items-center w-full h-navbar border-b",
				// La barra es transparente solo en la Home Y cuando no se ha hecho scroll.
				isHomePage && !isScrolled
					? [
							"bg-transparent border-white/10 shadow-none py-6",
							"text-white",
							"[--nav-action-color:white] [--theme-btn-hover:rgba(255,255,255,0.15)]",
						]
					: [
							"bg-background border-border shadow-soft py-4",
							"text-foreground",
							"[--nav-action-color:var(--color-stone-900)]",
						],
			)}
		>
			<div className="container flex justify-between items-center h-full">
				{/* Logo. */}
				<Logo />

				{/* --- Contenedor de la derecha: tema y controles de usuario --- */}
				<div className="flex items-center gap-2 md:gap-4 ml-auto">
					{/* Botón de tema */}
					<ThemeToggleButton />

					{/* Contenido de navegación. */}
					<div className="flex items-center">{renderNavContent()}</div>
				</div>
			</div>
		</nav>
	);
}
