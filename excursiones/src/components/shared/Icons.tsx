import React from "react"; // Necesario para el tipo React.ComponentType
import { FiMapPin, FiTrash2 } from "react-icons/fi";
import { BsBarChartFill } from "react-icons/bs";
import { FaRegClock } from "react-icons/fa";
import { LuMoon, LuSun } from "react-icons/lu";

/**
 * Archivo central para exportar los componentes de íconos de la aplicación.
 *
 * Se utiliza una aserción de tipo `as React.ComponentType` para asegurar la
 * compatibilidad con la configuración estricta de TypeScript del proyecto,
 * que no permite el uso de los íconos directamente en JSX sin esta aserción.
 */

export const MapIcon = FiMapPin as React.ComponentType<{ className?: string }>;
export const ChartIcon = BsBarChartFill as React.ComponentType<{
	className?: string;
}>;
export const ClockIcon = FaRegClock as React.ComponentType<{
	className?: string;
}>;
export const TrashIcon = FiTrash2 as React.ComponentType<{
	className?: string;
}>;

export const MoonIcon = LuMoon as React.ComponentType<{
	className: string;
}>;

export const SunIcon = LuSun as React.ComponentType<{
	className: string;
}>;
