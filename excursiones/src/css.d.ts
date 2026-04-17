/**
 * Declaración de tipos para los módulos CSS.
 */

// Permite importaciones de archivos CSS globales como efectos secundarios.
declare module "*.css";

declare module "*.module.css" {
	const classes: { readonly [key: string]: string };
	export default classes;
}
