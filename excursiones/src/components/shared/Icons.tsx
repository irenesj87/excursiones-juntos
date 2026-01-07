import React from "react";
import {
	LuMountainSnow,
	LuTriangleAlert,
	LuSearch,
	LuMoon,
	LuSun,
	LuFilter,
	LuFilterX,
	LuMapPin,
	LuChartNoAxesColumnIncreasing,
	LuClock3,
	LuCircleCheckBig,
	LuCopyright,
	LuUser,
	LuUsers,
	LuPhone,
	LuMail,
	LuPencil,
	LuX,
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
// Icono de alerta.
export const AlertIcon = LuTriangleAlert as React.ComponentType<IconProps>;
// Icono de la lupa para la barra de búsqueda.
export const SearchIcon = LuSearch as React.ComponentType<IconProps>;
// Icono de una "x" para limpiar la barra de búsqueda.
export const ClearIcon = LuX as React.ComponentType<IconProps>;
// Icono de una luna para el botón de cambio de tema.
export const MoonIcon = LuMoon as React.ComponentType<IconProps>;
// Icono de un sol para el cambio de tema.
export const SunIcon = LuSun as React.ComponentType<IconProps>;
// Icono de un pin para la zona.
export const MapIcon = LuMapPin as React.ComponentType<IconProps>;
// Icono para la dificultad de las excursiones.
export const ChartIcon =
	LuChartNoAxesColumnIncreasing as React.ComponentType<IconProps>;
// Icono para el tiempo estimado de las excursiones.
export const ClockIcon = LuClock3 as React.ComponentType<IconProps>;
// Icono para los filtros
export const FilterIcon = LuFilter as React.ComponentType<IconProps>;
// Icono para la opción de limpiar los filtros
export const FilterXIcon = LuFilterX as React.ComponentType<IconProps>;
// Icono de un check para verificar algo
export const CheckIcon = LuCircleCheckBig as React.ComponentType<IconProps>;
// Icono del copyright para el footer
export const CopyrightIcon = LuCopyright as React.ComponentType<IconProps>;
// Icono de usuario para campos de nombre
export const UserIcon = LuUser as React.ComponentType<IconProps>;
// Icono de usuario para campos de apellidos
export const UsersIcon = LuUsers as React.ComponentType<IconProps>;
// Icono de teléfono
export const PhoneIcon = LuPhone as React.ComponentType<IconProps>;
// Icono de correo electrónico
export const MailIcon = LuMail as React.ComponentType<IconProps>;
// Icono de lápiz para editar
export const EditIcon = LuPencil as React.ComponentType<IconProps>;
// Icono de X para cancelar
export const CancelIcon = LuX as React.ComponentType<IconProps>;
