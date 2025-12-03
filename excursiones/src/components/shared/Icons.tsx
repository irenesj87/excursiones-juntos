import React from "react";
import {
	LuSearch,
	LuMoon,
	LuSun,
	LuMapPin,
	LuChartNoAxesColumnIncreasing,
	LuClock3,
	LuTrash2,
	LuCheck,
} from "react-icons/lu";

/**
 * Archivo central para exportar los componentes de íconos de la aplicación.
 *
 * Se utiliza una aserción de tipo `as React.ComponentType` para asegurar la
 * compatibilidad con la configuración estricta de TypeScript del proyecto,
 * que no permite el uso de los íconos directamente en JSX sin esta aserción.
 */
export const SearchIcon = LuSearch as React.ComponentType<{
	className?: string;
}>;
export const MapIcon = LuMapPin as React.ComponentType<{ className?: string }>;
export const ChartIcon = LuChartNoAxesColumnIncreasing as React.ComponentType<{
	className?: string;
}>;
export const ClockIcon = LuClock3 as React.ComponentType<{
	className?: string;
}>;
export const TrashIcon = LuTrash2 as React.ComponentType<{
	className?: string;
}>;
export const MoonIcon = LuMoon as React.ComponentType<{
	className?: string;
}>;
export const SunIcon = LuSun as React.ComponentType<{
	className?: string;
}>;
export const CheckIcon = LuCheck as React.ComponentType<{
	className?: string;
}>;
