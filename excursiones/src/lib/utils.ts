import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de Tailwind CSS de forma segura, resolviendo conflictos de especificidad.
 * Fundamental para el sistema de diseño de shadcn/ui.
 * @param inputs - Lista de clases, objetos o condicionales.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
