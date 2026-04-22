import React from "react";
import {
	MountainSnow,
	Moon,
	Sun,
	LogIn,
	CircleUser,
	LogOut,
	Backpack,
	MapPin,
	ChartLine,
	Clock3,
	Search,
	Check,
	ImageOff,
	CircleAlert,
	TriangleAlert,
	X,
	Eye,
	EyeOff,
	User,
	Mail,
	Copyright,
	ArrowUp,
	Loader,
} from "lucide-react";

// Tipo base para las props de los iconos
type IconProps = {
	className?: string;
	size?: number | string;
	"aria-hidden"?: boolean | string;
};

/**
 * Archivo central para exportar los componentes de íconos de la aplicación.
 */
// Icono del logo
export const LogoIcon = MountainSnow as React.ComponentType<IconProps>;
// Icono de una luna para el botón de cambio de tema.
export const MoonIcon = Moon as React.ComponentType<IconProps>;
// Icono de un sol para el cambio de tema.
export const SunIcon = Sun as React.ComponentType<IconProps>;
// Icono para el inicio de sesión
export const LoginIcon = LogIn as React.ComponentType<IconProps>;
// Icono para el perfil de usuario
export const ProfileIcon = CircleUser as React.ComponentType<IconProps>;
// Icono para el cierre de sesión
export const LogoutIcon = LogOut as React.ComponentType<IconProps>;
// Icono de mochila para la sección "Sobre Nosotros"
export const BackpackIcon = Backpack as React.ComponentType<IconProps>;
// Icono de un pin para la zona.
export const MapIcon = MapPin as React.ComponentType<IconProps>;
// Icono para la dificultad de las excursiones.
export const ChartIcon = ChartLine as React.ComponentType<IconProps>;
// Icono para el tiempo estimado de las excursiones.
export const ClockIcon = Clock3 as React.ComponentType<IconProps>;
// Icono de la lupa para la barra de búsqueda.
export const SearchIcon = Search as React.ComponentType<IconProps>;
// Icono de check para éxito.
export const CheckIcon = Check as React.ComponentType<IconProps>;
// Icono de alerta circular para errores.
export const CircleAlertIcon = CircleAlert as React.ComponentType<IconProps>;
// Icono de alerta triangular.
export const TriangleAlertIcon =
	TriangleAlert as React.ComponentType<IconProps>;
// Icono de una "x" para limpiar la barra de búsqueda.
export const XIcon = X as React.ComponentType<IconProps>;
// Icono para mostrar que la excursión no tiene imagen
export const NoImageIcon = ImageOff as React.ComponentType<IconProps>;
// Icono de ojo para mostrar contraseña
export const EyeIcon = Eye as React.ComponentType<IconProps>;
// Icono de ojo tachado para ocultar contraseña
export const EyeOffIcon = EyeOff as React.ComponentType<IconProps>;
// Icono de usuario para el perfil
export const UserIcon = User as React.ComponentType<IconProps>;
// Icono de correo para el footer
export const MailIcon = Mail as React.ComponentType<IconProps>;
// Icono del copyright para el footer
export const CopyrightIcon = Copyright as React.ComponentType<IconProps>;
// Icono de flecha hacia arriba para el botón de "Scroll to Top"
export const ArrowUpIcon = ArrowUp as React.ComponentType<IconProps>;
// Icono de carga para estados de espera (spinner)
export const LoaderIcon = Loader as React.ComponentType<IconProps>;
