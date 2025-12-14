import React from "react";
import {
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
} from "react-icons/lu";

import { MdClear } from "react-icons/md";

/**
 * Archivo central para exportar los componentes de íconos de la aplicación.
 *
 * Se utiliza una aserción de tipo `as React.ComponentType` para asegurar la
 * compatibilidad con la configuración estricta de TypeScript del proyecto,
 * que no permite el uso de los íconos directamente en JSX sin esta aserción.
 */
// Icono de la lupa para la barra de búsqueda.
export const SearchIcon = LuSearch as React.ComponentType<{
	className?: string;
}>;
// Icono de una "x" para limpiar la barra de búsqueda.
export const ClearIcon = MdClear as React.ComponentType<{
	className?: string;
}>;
// Icono de una luna para el botón de cambio de tema.
export const MoonIcon = LuMoon as React.ComponentType<{
	className?: string;
}>;
// Icono de un sol para el cambio de tema.
export const SunIcon = LuSun as React.ComponentType<{
	className?: string;
}>;

export const MapIcon = LuMapPin as React.ComponentType<{ className?: string }>;

export const ChartIcon = LuChartNoAxesColumnIncreasing as React.ComponentType<{
	className?: string;
}>;

export const ClockIcon = LuClock3 as React.ComponentType<{
	className?: string;
}>;

export const FilterIcon = LuFilter as React.ComponentType<{
	className?: string;
}>;

export const FilterXIcon = LuFilterX as React.ComponentType<{
	className?: string;
}>;

export const CheckIcon = LuCircleCheckBig as React.ComponentType<{
	className?: string;
}>;

export const CopyrightIcon = LuCopyright as React.ComponentType<{
	className?: string;
}>;
