import React from "react";
import {
	LuMountainSnow,
	LuMoon,
	LuSun,
	LuLogIn,
	LuCircleUser,
	LuLogOut,
	LuBackpack,
	LuMapPin,
	LuChartLine,
	LuClock3,
	LuSearch,
	LuCheck,
	LuImageOff,
	LuCircleAlert,
	LuTriangleAlert,
	LuX,
	LuEye,
	LuEyeOff,
	LuUser,
	LuMail,
	LuCopyright,
} from "react-icons/lu";

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
export const LogoIcon = LuMountainSnow as React.ComponentType<IconProps>;
// Icono de una luna para el botón de cambio de tema.
export const MoonIcon = LuMoon as React.ComponentType<IconProps>;
// Icono de un sol para el cambio de tema.
export const SunIcon = LuSun as React.ComponentType<IconProps>;
// Icono para el inicio de sesión
export const LoginIcon = LuLogIn as React.ComponentType<IconProps>;
// Icono para el perfil de usuario
export const ProfileIcon = LuCircleUser as React.ComponentType<IconProps>;
// Icono para el cierre de sesión
export const LogoutIcon = LuLogOut as React.ComponentType<IconProps>;
// Icono de mochila para la sección "Sobre Nosotros"
export const BackpackIcon = LuBackpack as React.ComponentType<IconProps>;
// Icono de un pin para la zona.
export const MapIcon = LuMapPin as React.ComponentType<IconProps>;
// Icono para la dificultad de las excursiones.
export const ChartIcon = LuChartLine as React.ComponentType<IconProps>;
// Icono para el tiempo estimado de las excursiones.
export const ClockIcon = LuClock3 as React.ComponentType<IconProps>;
// Icono de la lupa para la barra de búsqueda.
export const SearchIcon = LuSearch as React.ComponentType<IconProps>;
// Icono de check circular para éxito.
export const CheckIcon = LuCheck as React.ComponentType<IconProps>;
// Icono de alerta circular para errores.
export const CircleAlertIcon = LuCircleAlert as React.ComponentType<IconProps>;
// Icono de alerta triangular.
export const TriangleAlertIcon =
	LuTriangleAlert as React.ComponentType<IconProps>;
// Icono de una "x" para limpiar la barra de búsqueda.
export const XIcon = LuX as React.ComponentType<IconProps>;
// Icono para mostrar que la excursión no tiene imagen
export const NoImageIcon = LuImageOff as React.ComponentType<IconProps>;
// Icono de ojo para mostrar contraseña
export const EyeIcon = LuEye as React.ComponentType<IconProps>;
// Icono de ojo tachado para ocultar contraseña
export const EyeOffIcon = LuEyeOff as React.ComponentType<IconProps>;
// Icono de usuario para el perfil
export const UserIcon = LuUser as React.ComponentType<IconProps>;
// Icono de correo para el footer
export const MailIcon = LuMail as React.ComponentType<IconProps>;
// Icono del copyright para el footer
export const CopyrightIcon = LuCopyright as React.ComponentType<IconProps>;
