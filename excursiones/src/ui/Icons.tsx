import React from "react";
import { PiMountainsFill } from "react-icons/pi";
import {
	LuLogIn,
	LuLogOut,
	LuCircleAlert,
	LuTriangleAlert,
	LuSearch,
	LuImageOff,
	LuMapPin,
	LuChartNoAxesColumnIncreasing,
	LuClock3,
	LuCircleCheck,
	LuCopyright,
	LuUserPlus,
	LuCircleUser,
	LuMail,
	LuX,
	LuEye,
	LuEyeOff,
} from "react-icons/lu";
import { AiFillMoon, AiFillSun } from "react-icons/ai";
import { BsBackpack, BsEnvelopeAtFill } from "react-icons/bs";
import { HiUser } from "react-icons/hi";

// Tipo base para las props de los iconos
type IconProps = {
	className?: string;
	size?: number | string;
	"aria-hidden"?: boolean | string;
};

/**
 * Archivo central para exportar los componentes de íconos de la aplicación.
 */
// Icono para el inicio de sesión
export const LoginIcon = LuLogIn as React.ComponentType<IconProps>;
// Icono para el cierre de sesión
export const LogoutIcon = LuLogOut as React.ComponentType<IconProps>;
// Icono del logo
export const LogoIcon = PiMountainsFill as React.ComponentType<IconProps>;
// Icono de alerta circular para errores.

export const CircleAlertIcon = LuCircleAlert as React.ComponentType<IconProps>;
// Icono de check circular para éxito.
export const CheckCircleIcon = LuCircleCheck as React.ComponentType<IconProps>;
// Icono de alerta triangular.
export const TriangleAlertIcon =
	LuTriangleAlert as React.ComponentType<IconProps>;
// Icono de la lupa para la barra de búsqueda.
export const SearchIcon = LuSearch as React.ComponentType<IconProps>;
// Icono de una "x" para limpiar la barra de búsqueda.
export const XIcon = LuX as React.ComponentType<IconProps>;
// Icono de una luna para el botón de cambio de tema.
export const MoonIcon = AiFillMoon as React.ComponentType<IconProps>;
// Icono de un sol para el cambio de tema.
export const SunIcon = AiFillSun as React.ComponentType<IconProps>;
// Icono para mostrar que la excursión no tiene imagen
export const NoImageIcon = LuImageOff as React.ComponentType<IconProps>;
// Icono de un pin para la zona.
export const MapIcon = LuMapPin as React.ComponentType<IconProps>;
// Icono para la dificultad de las excursiones.
export const ChartIcon =
	LuChartNoAxesColumnIncreasing as React.ComponentType<IconProps>;
// Icono para el tiempo estimado de las excursiones.
export const ClockIcon = LuClock3 as React.ComponentType<IconProps>;
// Icono del copyright para el footer
export const CopyrightIcon = LuCopyright as React.ComponentType<IconProps>;
// Icono de usuario para campos de nombre
export const UserIcon = HiUser as React.ComponentType<IconProps>;
// Icono para el enlace de perfil en la navegación (Avatar)
export const ProfileIcon = LuCircleUser as React.ComponentType<IconProps>;
// Icono para unirse a una excursión.
export const JoinIcon = LuUserPlus as React.ComponentType<IconProps>;
// Icono de correo electrónico
export const MailIcon = LuMail as React.ComponentType<IconProps>;
// Icono de ojo para mostrar contraseña
export const EyeIcon = LuEye as React.ComponentType<IconProps>;
// Icono de ojo tachado para ocultar contraseña
export const EyeOffIcon = LuEyeOff as React.ComponentType<IconProps>;
// Icono de mochila para la sección "Sobre Nosotros"
export const BackpackIcon = BsBackpack as React.ComponentType<IconProps>;
// Icono de sobre para el contacto en el footer
export const EnvelopeIcon = BsEnvelopeAtFill as React.ComponentType<IconProps>;
